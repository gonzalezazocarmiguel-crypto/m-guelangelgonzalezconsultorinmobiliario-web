import { NextResponse } from "next/server";
import { getSettings, saveSettings, isMissingDatabaseError } from "@/lib/db";

const DB_ERROR_RESPONSE = NextResponse.json(
  { error: "Falta conectar la base de datos Postgres en Vercel (Storage → Create Database)." },
  { status: 503 }
);

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    if (isMissingDatabaseError(err)) return DB_ERROR_RESPONSE;
    throw err;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
  const actorId = typeof body.actorId === "string" ? body.actorId.trim() : "";
  const inputTemplate =
    typeof body.inputTemplate === "string" ? body.inputTemplate.trim() : "";

  if (inputTemplate) {
    try {
      JSON.parse(inputTemplate);
    } catch {
      return NextResponse.json(
        { error: "La plantilla de input debe ser un JSON válido." },
        { status: 400 }
      );
    }
  }

  try {
    await saveSettings({ apiKey, actorId, inputTemplate });
    return NextResponse.json(await getSettings());
  } catch (err) {
    if (isMissingDatabaseError(err)) return DB_ERROR_RESPONSE;
    throw err;
  }
}
