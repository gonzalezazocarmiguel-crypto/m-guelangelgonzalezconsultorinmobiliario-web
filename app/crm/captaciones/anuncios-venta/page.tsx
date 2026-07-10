import { listListings } from "@/lib/db";
import AnunciosVentaClient from "@/components/crm/AnunciosVentaClient";

export const dynamic = "force-dynamic";

export default async function AnunciosVentaPage() {
  const listings = await listListings();
  return <AnunciosVentaClient initialListings={listings} />;
}
