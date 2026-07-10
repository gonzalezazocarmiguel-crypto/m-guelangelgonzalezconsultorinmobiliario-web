import { NextResponse } from "next/server";
import { updateListingStatus, type ListingStatus } from "@/lib/db";

const VALID_STATUSES: ListingStatus[] = ["CONTACTAR", "CONTACTADO", "CAPTADO", "DESCARTADO"];

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = await request.json();
  const status = body.status;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Fase inválida. Debe ser una de: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const listing = updateListingStatus(id, status);
  if (!listing) {
    return NextResponse.json({ error: "Anuncio no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ listing });
}
