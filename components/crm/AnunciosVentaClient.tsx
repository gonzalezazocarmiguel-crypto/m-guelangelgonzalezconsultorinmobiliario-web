"use client";

import { useState } from "react";
import Link from "next/link";
import type { Listing, ListingStatus } from "@/lib/db";
import ListingCard from "@/components/crm/ListingCard";

const STATUS_TABS: { label: string; value: ListingStatus | "TODAS" }[] = [
  { label: "Todas", value: "TODAS" },
  { label: "Contactar", value: "CONTACTAR" },
  { label: "Contactado", value: "CONTACTADO" },
  { label: "Captado", value: "CAPTADO" },
  { label: "Descartado", value: "DESCARTADO" },
];

export default function AnunciosVentaClient({
  initialListings,
}: {
  initialListings: Listing[];
}) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [tab, setTab] = useState<ListingStatus | "TODAS">("TODAS");
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const handleScrape = async () => {
    setScraping(true);
    setError(null);
    setSummary(null);
    try {
      const res = await fetch("/api/crm/scrape", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo completar la búsqueda.");
        return;
      }
      setListings(data.listings ?? []);
      setSummary(
        `${data.scraped} anuncios revisados · ${data.matched} coinciden con particulares en Madrid · ${data.inserted} nuevos, ${data.updated} actualizados.`
      );
    } catch {
      setError("Error de red al llamar a Apify.");
    } finally {
      setScraping(false);
    }
  };

  const handleStatusChange = async (id: string, status: ListingStatus) => {
    const res = await fetch(`/api/crm/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setListings((prev) => prev.map((l) => (l.id === id ? data.listing : l)));
    }
  };

  const filtered = tab === "TODAS" ? listings : listings.filter((l) => l.status === tab);

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
          Captaciones
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black tracking-tight">Anuncios de venta · Idealista</h1>
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="px-4 py-2.5 rounded-xl bg-black text-white text-sm font-bold tracking-wide hover:bg-black/85 transition-colors disabled:opacity-50"
          >
            {scraping ? "Buscando…" : "Buscar en Idealista"}
          </button>
        </div>
        <p className="text-sm text-black/50">
          Particulares · Zona Madrid. Configura tu API Key y Actor ID de Apify en{" "}
          <Link href="/crm/ajustes" className="underline underline-offset-2 hover:text-black">
            Ajustes
          </Link>
          .
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}
      {summary && !error && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm px-4 py-3">
          {summary}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors ${
              tab === t.value ? "bg-black text-white" : "bg-black/5 text-black/50 hover:bg-black/10"
            }`}
          >
            {t.label} {t.value === "TODAS" ? `(${listings.length})` : `(${listings.filter((l) => l.status === t.value).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 py-16 text-center text-black/40 text-sm">
          No hay anuncios en esta fase todavía. Pulsa &ldquo;Buscar en Idealista&rdquo; para traer captaciones.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
