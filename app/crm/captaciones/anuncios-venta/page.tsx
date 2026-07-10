import { listListings } from "@/lib/db";
import AnunciosVentaClient from "@/components/crm/AnunciosVentaClient";

export const dynamic = "force-dynamic";

export default function AnunciosVentaPage() {
  const listings = listListings();
  return <AnunciosVentaClient initialListings={listings} />;
}
