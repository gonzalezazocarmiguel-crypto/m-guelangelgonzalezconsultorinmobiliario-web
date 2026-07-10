import { NextResponse } from "next/server";
import { listListings, type ListingStatus } from "@/lib/db";

const VALID_STATUSES: ListingStatus[] = ["CONTACTAR", "CONTACTADO", "CAPTADO", "DESCARTADO"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status =
    statusParam && VALID_STATUSES.includes(statusParam as ListingStatus)
      ? (statusParam as ListingStatus)
      : undefined;

  return NextResponse.json({ listings: await listListings(status) });
}
