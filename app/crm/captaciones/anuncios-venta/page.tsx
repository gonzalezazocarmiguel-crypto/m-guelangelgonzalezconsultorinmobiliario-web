import { listListings, isMissingDatabaseError, type Listing } from "@/lib/db";
import AnunciosVentaClient from "@/components/crm/AnunciosVentaClient";
import DatabaseSetupNotice from "@/components/crm/DatabaseSetupNotice";

export const dynamic = "force-dynamic";

export default async function AnunciosVentaPage() {
  let listings: Listing[] | null = null;
  try {
    listings = await listListings();
  } catch (err) {
    if (!isMissingDatabaseError(err)) throw err;
  }

  if (!listings) return <DatabaseSetupNotice />;
  return <AnunciosVentaClient initialListings={listings} />;
}
