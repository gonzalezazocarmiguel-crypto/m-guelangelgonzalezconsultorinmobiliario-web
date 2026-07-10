import crypto from "node:crypto";
import type { UpsertListingInput } from "./db";

type RawItem = Record<string, unknown>;

function get(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function firstDefined(item: RawItem, paths: string[]): unknown {
  for (const path of paths) {
    const value = get(item, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const digits = value.replace(/[^\d]/g, "");
    if (digits) return Number(digits);
  }
  return null;
}

function toText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return null;
}

/** Normalizes a raw Apify dataset item (shape varies by scraper actor) into our listing schema. */
export function normalizeListing(item: RawItem): UpsertListingInput & {
  isParticular: boolean;
  isMadrid: boolean;
} {
  const url = toText(
    firstDefined(item, ["url", "propertyUrl", "link", "adUrl", "sourceUrl"])
  );

  const idSource = toText(
    firstDefined(item, ["id", "propertyCode", "adid", "code"])
  );
  const id = idSource ?? (url ? hash(url) : hash(JSON.stringify(item)));

  const location = toText(
    firstDefined(item, [
      "location",
      "address",
      "zone",
      "neighborhood",
      "municipality",
      "propertyInfo.location",
      "detailedAddress",
    ])
  );

  const price = toNumber(
    firstDefined(item, ["price", "priceInfo.amount", "priceInfo.price", "priceInfo.amount.value"])
  );

  const ownerName = toText(
    firstDefined(item, [
      "contactInfo.commercialName",
      "contactInfo.name",
      "contactName",
      "ownerName",
      "advertiserName",
    ])
  );

  const contactPhone = toText(
    firstDefined(item, [
      "contactInfo.phone1",
      "contactInfo.phone",
      "contactInfo.phoneNumber",
      "phone",
      "phone1",
      "contactPhone",
    ])
  );

  const sizeM2 = toNumber(
    firstDefined(item, [
      "size",
      "constructedArea",
      "moreCharacteristics.constructedArea",
      "propertyInfo.size",
      "surface",
      "area",
    ])
  );

  const zone = toText(
    firstDefined(item, ["zone", "district", "neighborhood", "location", "address"])
  );

  const title = toText(firstDefined(item, ["title", "adTitle", "suggestedTexts.title"]));

  const advertiserTypeRaw = toText(
    firstDefined(item, [
      "contactInfo.userType",
      "advertiserType",
      "contactInfo.professionalType",
      "isProfessional",
      "particular",
    ])
  );

  const isParticular = guessIsParticular(advertiserTypeRaw, item);
  const isMadrid = [location, zone].some((v) => v?.toLowerCase().includes("madrid"));

  return {
    id,
    sourceUrl: url,
    location,
    price,
    ownerName,
    contactPhone,
    sizeM2,
    zone,
    title,
    raw: JSON.stringify(item),
    isParticular,
    isMadrid,
  };
}

function guessIsParticular(advertiserTypeRaw: string | null, item: RawItem): boolean {
  if (advertiserTypeRaw) {
    const v = advertiserTypeRaw.toLowerCase();
    if (v.includes("particular") || v === "true" || v === "private" || v === "owner") return true;
    if (v.includes("profesional") || v.includes("agency") || v.includes("agencia") || v === "false")
      return false;
  }
  const isProfessionalFlag = get(item, "contactInfo.isProfessional");
  if (typeof isProfessionalFlag === "boolean") return !isProfessionalFlag;

  // No reliable signal: trust the upstream search filter (con-particulares) and include it.
  return true;
}

function hash(value: string): string {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 16);
}

export type ApifyRunResult = {
  items: RawItem[];
};

export async function runApifyActor(
  actorId: string,
  apiKey: string,
  input: unknown
): Promise<ApifyRunResult> {
  const encodedActorId = actorId.includes("/") ? actorId.replace("/", "~") : actorId;
  const endpoint = `https://api.apify.com/v2/acts/${encodeURIComponent(
    encodedActorId
  )}/run-sync-get-dataset-items?token=${encodeURIComponent(apiKey)}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Apify respondió ${res.status}: ${body.slice(0, 500)}`);
  }

  const items = (await res.json()) as RawItem[];
  return { items: Array.isArray(items) ? items : [] };
}
