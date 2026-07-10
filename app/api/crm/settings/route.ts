import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";

export async function GET() {
  const settings = getSettings();
  return NextResponse.json(settings);
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

  saveSettings({ apiKey, actorId, inputTemplate });
  return NextResponse.json(getSettings());
}
