import { DatabaseSync } from "node:sqlite";
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

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(path.join(dataDir, "crm.sqlite"));

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    apify_api_key TEXT NOT NULL DEFAULT '',
    apify_actor_id TEXT NOT NULL DEFAULT '',
    input_template TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL
  );

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
  );
`);

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

export function getSettings(): ApifySettings {
  const row = db
    .prepare("SELECT apify_api_key, apify_actor_id, input_template FROM settings WHERE id = 1")
    .get() as { apify_api_key: string; apify_actor_id: string; input_template: string } | undefined;

  if (!row) {
    return { apiKey: "", actorId: "", inputTemplate: DEFAULT_INPUT_TEMPLATE };
  }

  return {
    apiKey: row.apify_api_key,
    actorId: row.apify_actor_id,
    inputTemplate: row.input_template || DEFAULT_INPUT_TEMPLATE,
  };
}

export function saveSettings(settings: ApifySettings) {
  db.prepare(
    `INSERT INTO settings (id, apify_api_key, apify_actor_id, input_template, updated_at)
     VALUES (1, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       apify_api_key = excluded.apify_api_key,
       apify_actor_id = excluded.apify_actor_id,
       input_template = excluded.input_template,
       updated_at = excluded.updated_at`
  ).run(settings.apiKey, settings.actorId, settings.inputTemplate, new Date().toISOString());
}

function rowToListing(row: Record<string, unknown>): Listing {
  return {
    id: row.id as string,
    sourceUrl: (row.source_url as string) ?? null,
    location: (row.location as string) ?? null,
    price: (row.price as number) ?? null,
    ownerName: (row.owner_name as string) ?? null,
    contactPhone: (row.contact_phone as string) ?? null,
    sizeM2: (row.size_m2 as number) ?? null,
    zone: (row.zone as string) ?? null,
    title: (row.title as string) ?? null,
    raw: (row.raw as string) ?? null,
    status: row.status as ListingStatus,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function listListings(status?: ListingStatus): Listing[] {
  const rows = status
    ? (db
        .prepare("SELECT * FROM listings WHERE status = ? ORDER BY created_at DESC")
        .all(status) as Record<string, unknown>[])
    : (db.prepare("SELECT * FROM listings ORDER BY created_at DESC").all() as Record<
        string,
        unknown
      >[]);

  return rows.map(rowToListing);
}

export type UpsertListingInput = Omit<Listing, "status" | "createdAt" | "updatedAt">;

export function upsertListings(items: UpsertListingInput[]): { inserted: number; updated: number } {
  let inserted = 0;
  let updated = 0;
  const now = new Date().toISOString();

  const existsStmt = db.prepare("SELECT id FROM listings WHERE id = ?");
  const insertStmt = db.prepare(
    `INSERT INTO listings
       (id, source_url, location, price, owner_name, contact_phone, size_m2, zone, title, raw, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONTACTAR', ?, ?)`
  );
  const updateStmt = db.prepare(
    `UPDATE listings SET
       source_url = ?, location = ?, price = ?, owner_name = ?, contact_phone = ?,
       size_m2 = ?, zone = ?, title = ?, raw = ?, updated_at = ?
     WHERE id = ?`
  );

  for (const item of items) {
    const existing = existsStmt.get(item.id);
    if (existing) {
      updateStmt.run(
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
        item.id
      );
      updated++;
    } else {
      insertStmt.run(
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
        now
      );
      inserted++;
    }
  }

  return { inserted, updated };
}

export function updateListingStatus(id: string, status: ListingStatus): Listing | null {
  db.prepare("UPDATE listings SET status = ?, updated_at = ? WHERE id = ?").run(
    status,
    new Date().toISOString(),
    id
  );
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;
  return row ? rowToListing(row) : null;
}
