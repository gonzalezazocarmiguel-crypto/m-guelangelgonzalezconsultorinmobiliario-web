import { NextResponse } from "next/server";
import { listListings, isMissingDatabaseError, type ListingStatus } from "@/lib/db";

const VALID_STATUSES: ListingStatus[] = ["CONTACTAR", "CONTACTADO", "CAPTADO", "DESCARTADO"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status =
    statusParam && VALID_STATUSES.includes(statusParam as ListingStatus)
      ? (statusParam as ListingStatus)
      : undefined;

  try {
    return NextResponse.json({ listings: await listListings(status) });
  } catch (err) {
    if (isMissingDatabaseError(err)) {
      return NextResponse.json(
        { error: "Falta conectar la base de datos Postgres en Vercel (Storage → Create Database)." },
        { status: 503 }
      );
    }
    throw err;
  }
}
