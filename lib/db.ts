import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

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

// Populated automatically when you attach a Vercel Postgres (Neon) database
// to the project. Resolved lazily (not at import time) so the app can still
// build/boot before a database is connected.
let sqlClient: NeonQueryFunction<false, false> | null = null;

function db(): NeonQueryFunction<false, false> {
  if (!sqlClient) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error(
        "Falta DATABASE_URL/POSTGRES_URL. Conecta una base de datos Postgres (Neon) al proyecto en Vercel."
      );
    }
    sqlClient = neon(connectionString);
  }
  return sqlClient;
}

let ready: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await db()`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          apify_api_key TEXT NOT NULL DEFAULT '',
          apify_actor_id TEXT NOT NULL DEFAULT '',
          input_template TEXT NOT NULL DEFAULT '',
          updated_at TEXT NOT NULL
        )
      `;
      await db()`
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
      `;
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

export function isMissingDatabaseError(err: unknown): boolean {
  return err instanceof Error && err.message.includes("DATABASE_URL");
}

export async function getSettings(): Promise<ApifySettings> {
  await ensureReady();
  const rows = (await db()`
    SELECT apify_api_key, apify_actor_id, input_template FROM settings WHERE id = 1
  `) as { apify_api_key: string; apify_actor_id: string; input_template: string }[];
  const row = rows[0];

  if (!row) {
    return { apiKey: "", actorId: "", inputTemplate: DEFAULT_INPUT_TEMPLATE };
  }

  return {
    apiKey: row.apify_api_key ?? "",
    actorId: row.apify_actor_id ?? "",
    inputTemplate: row.input_template || DEFAULT_INPUT_TEMPLATE,
  };
}

export async function saveSettings(settings: ApifySettings): Promise<void> {
  await ensureReady();
  await db()`
    INSERT INTO settings (id, apify_api_key, apify_actor_id, input_template, updated_at)
    VALUES (1, ${settings.apiKey}, ${settings.actorId}, ${settings.inputTemplate}, ${new Date().toISOString()})
    ON CONFLICT (id) DO UPDATE SET
      apify_api_key = EXCLUDED.apify_api_key,
      apify_actor_id = EXCLUDED.apify_actor_id,
      input_template = EXCLUDED.input_template,
      updated_at = EXCLUDED.updated_at
  `;
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
  const rows = status
    ? await db()`SELECT * FROM listings WHERE status = ${status} ORDER BY created_at DESC`
    : await db()`SELECT * FROM listings ORDER BY created_at DESC`;

  return (rows as Record<string, unknown>[]).map(rowToListing);
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
    const existing = await db()`SELECT id FROM listings WHERE id = ${item.id}`;

    if (existing.length > 0) {
      await db()`
        UPDATE listings SET
          source_url = ${item.sourceUrl},
          location = ${item.location},
          price = ${item.price},
          owner_name = ${item.ownerName},
          contact_phone = ${item.contactPhone},
          size_m2 = ${item.sizeM2},
          zone = ${item.zone},
          title = ${item.title},
          raw = ${item.raw},
          updated_at = ${now}
        WHERE id = ${item.id}
      `;
      updated++;
    } else {
      await db()`
        INSERT INTO listings
          (id, source_url, location, price, owner_name, contact_phone, size_m2, zone, title, raw, status, created_at, updated_at)
        VALUES
          (${item.id}, ${item.sourceUrl}, ${item.location}, ${item.price}, ${item.ownerName}, ${item.contactPhone}, ${item.sizeM2}, ${item.zone}, ${item.title}, ${item.raw}, 'CONTACTAR', ${now}, ${now})
      `;
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
  await db()`
    UPDATE listings SET status = ${status}, updated_at = ${new Date().toISOString()} WHERE id = ${id}
  `;
  const rows = await db()`SELECT * FROM listings WHERE id = ${id}`;
  const row = rows[0] as Record<string, unknown> | undefined;
  return row ? rowToListing(row) : null;
}
