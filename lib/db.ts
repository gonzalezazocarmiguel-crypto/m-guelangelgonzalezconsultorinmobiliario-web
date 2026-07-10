import { createClient } from "@libsql/client";
import path from "node:path";
import fs from "node:fs";

export type ListingStatus = "CONTACTAR" | "CONTACTADO" | "CAPTADO" | "DESCARTADO";

export type Listing = {
  id: string;
  sourceUrl: string | null;
  location: string | null;
  price: number | null;
  ownerName: string | null;
  contactPhone: string | null;
  sizeM2: number | null;
  zone: string | null;
  title: string | null;
  raw: string | null;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
};

export type ApifySettings = {
  apiKey: string;
  actorId: string;
  inputTemplate: string;
};

function resolveLocalDbUrl(): string {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return `file:${path.join(dataDir, "crm.sqlite")}`;
}

// In production, point TURSO_DATABASE_URL/TURSO_AUTH_TOKEN at a Turso database
// (serverless hosts like Vercel wipe the local filesystem between requests).
// Locally, without those env vars, it falls back to a SQLite file on disk.
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || resolveLocalDbUrl(),
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let ready: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          apify_api_key TEXT NOT NULL DEFAULT '',
          apify_actor_id TEXT NOT NULL DEFAULT '',
          input_template TEXT NOT NULL DEFAULT '',
          updated_at TEXT NOT NULL
        )
      `);
      await client.execute(`
        CREATE TABLE IF NOT EXISTS listings (
          id TEXT PRIMARY KEY,
          source_url TEXT,
          location TEXT,
          price INTEGER,
          owner_name TEXT,
          contact_phone TEXT,
          size_m2 INTEGER,
          zone TEXT,
          title TEXT,
          raw TEXT,
          status TEXT NOT NULL DEFAULT 'CONTACTAR',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);
    })();
  }
  return ready;
}

const DEFAULT_INPUT_TEMPLATE = JSON.stringify(
  {
    startUrls: [
      { url: "https://www.idealista.com/venta-viviendas/madrid-madrid/con-particulares/" },
    ],
    maxItems: 60,
  },
  null,
  2
);

export async function getSettings(): Promise<ApifySettings> {
  await ensureReady();
  const result = await client.execute(
    "SELECT apify_api_key, apify_actor_id, input_template FROM settings WHERE id = 1"
  );
  const row = result.rows[0] as unknown as
    | { apify_api_key: string; apify_actor_id: string; input_template: string }
    | undefined;

  if (!row) {
    return { apiKey: "", actorId: "", inputTemplate: DEFAULT_INPUT_TEMPLATE };
  }

  return {
    apiKey: String(row.apify_api_key ?? ""),
    actorId: String(row.apify_actor_id ?? ""),
    inputTemplate: String(row.input_template || DEFAULT_INPUT_TEMPLATE),
  };
}

export async function saveSettings(settings: ApifySettings): Promise<void> {
  await ensureReady();
  await client.execute({
    sql: `INSERT INTO settings (id, apify_api_key, apify_actor_id, input_template, updated_at)
          VALUES (1, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            apify_api_key = excluded.apify_api_key,
            apify_actor_id = excluded.apify_actor_id,
            input_template = excluded.input_template,
            updated_at = excluded.updated_at`,
    args: [settings.apiKey, settings.actorId, settings.inputTemplate, new Date().toISOString()],
  });
}

function rowToListing(row: Record<string, unknown>): Listing {
  return {
    id: row.id as string,
    sourceUrl: (row.source_url as string) ?? null,
    location: (row.location as string) ?? null,
    price: row.price != null ? Number(row.price) : null,
    ownerName: (row.owner_name as string) ?? null,
    contactPhone: (row.contact_phone as string) ?? null,
    sizeM2: row.size_m2 != null ? Number(row.size_m2) : null,
    zone: (row.zone as string) ?? null,
    title: (row.title as string) ?? null,
    raw: (row.raw as string) ?? null,
    status: row.status as ListingStatus,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function listListings(status?: ListingStatus): Promise<Listing[]> {
  await ensureReady();
  const result = status
    ? await client.execute({
        sql: "SELECT * FROM listings WHERE status = ? ORDER BY created_at DESC",
        args: [status],
      })
    : await client.execute("SELECT * FROM listings ORDER BY created_at DESC");

  return result.rows.map((row) => rowToListing(row as Record<string, unknown>));
}

export type UpsertListingInput = Omit<Listing, "status" | "createdAt" | "updatedAt">;

export async function upsertListings(
  items: UpsertListingInput[]
): Promise<{ inserted: number; updated: number }> {
  await ensureReady();
  let inserted = 0;
  let updated = 0;
  const now = new Date().toISOString();

  for (const item of items) {
    const existing = await client.execute({
      sql: "SELECT id FROM listings WHERE id = ?",
      args: [item.id],
    });

    if (existing.rows.length > 0) {
      await client.execute({
        sql: `UPDATE listings SET
                source_url = ?, location = ?, price = ?, owner_name = ?, contact_phone = ?,
                size_m2 = ?, zone = ?, title = ?, raw = ?, updated_at = ?
              WHERE id = ?`,
        args: [
          item.sourceUrl,
          item.location,
          item.price,
          item.ownerName,
          item.contactPhone,
          item.sizeM2,
          item.zone,
          item.title,
          item.raw,
          now,
          item.id,
        ],
      });
      updated++;
    } else {
      await client.execute({
        sql: `INSERT INTO listings
                (id, source_url, location, price, owner_name, contact_phone, size_m2, zone, title, raw, status, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONTACTAR', ?, ?)`,
        args: [
          item.id,
          item.sourceUrl,
          item.location,
          item.price,
          item.ownerName,
          item.contactPhone,
          item.sizeM2,
          item.zone,
          item.title,
          item.raw,
          now,
          now,
        ],
      });
      inserted++;
    }
  }

  return { inserted, updated };
}

export async function updateListingStatus(
  id: string,
  status: ListingStatus
): Promise<Listing | null> {
  await ensureReady();
  await client.execute({
    sql: "UPDATE listings SET status = ?, updated_at = ? WHERE id = ?",
    args: [status, new Date().toISOString(), id],
  });
  const result = await client.execute({
    sql: "SELECT * FROM listings WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? rowToListing(row) : null;
}
