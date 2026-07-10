import { NextResponse } from "next/server";
import { getSettings, listListings, upsertListings } from "@/lib/db";
import { normalizeListing, runApifyActor } from "@/lib/apify";

export async function POST() {
  const settings = await getSettings();

  if (!settings.apiKey || !settings.actorId) {
    return NextResponse.json(
      {
        error:
          "Faltan credenciales de Apify. Configura la API Key y el Actor ID en Ajustes antes de buscar.",
      },
      { status: 400 }
    );
  }

  let input: unknown;
  try {
    input = JSON.parse(settings.inputTemplate || "{}");
  } catch {
    return NextResponse.json(
      { error: "La plantilla de input guardada en Ajustes no es un JSON válido." },
      { status: 400 }
    );
  }

  let items;
  try {
    const result = await runApifyActor(settings.actorId, settings.apiKey, input);
    items = result.items;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido llamando a Apify.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const normalized = items.map(normalizeListing);
  const filtered = normalized.filter((item) => item.isParticular && item.isMadrid);

  const toStore = filtered.map((item) => ({
    id: item.id,
    sourceUrl: item.sourceUrl,
    location: item.location,
    price: item.price,
    ownerName: item.ownerName,
    contactPhone: item.contactPhone,
    sizeM2: item.sizeM2,
    zone: item.zone,
    title: item.title,
    raw: item.raw,
  }));

  const { inserted, updated } = await upsertListings(toStore);

  return NextResponse.json({
    scraped: items.length,
    matched: filtered.length,
    inserted,
    updated,
    listings: await listListings(),
  });
}
