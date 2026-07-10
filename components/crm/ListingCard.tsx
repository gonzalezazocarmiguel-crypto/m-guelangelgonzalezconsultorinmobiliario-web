"use client";

import { useState } from "react";
import type { Listing, ListingStatus } from "@/lib/db";
import { buildOutreachMessage, buildWhatsappLink } from "@/lib/template";
import AsistenteIAModal from "./AsistenteIAModal";

const STATUS_OPTIONS: ListingStatus[] = ["CONTACTAR", "CONTACTADO", "CAPTADO", "DESCARTADO"];

const STATUS_STYLES: Record<ListingStatus, string> = {
  CONTACTAR: "bg-amber-100 text-amber-800",
  CONTACTADO: "bg-blue-100 text-blue-800",
  CAPTADO: "bg-green-100 text-green-800",
  DESCARTADO: "bg-neutral-200 text-neutral-500",
};

function formatPrice(price: number | null): string {
  if (!price) return "Precio no disponible";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    price
  );
}

export default function ListingCard({
  listing,
  onStatusChange,
}: {
  listing: Listing;
  onStatusChange: (id: string, status: ListingStatus) => void;
}) {
  const [showAssistant, setShowAssistant] = useState(false);
  const [updating, setUpdating] = useState(false);

  const message = buildOutreachMessage(listing);
  const whatsappLink = listing.contactPhone ? buildWhatsappLink(listing.contactPhone, message) : null;

  const handleStatus = async (status: ListingStatus) => {
    setUpdating(true);
    try {
      await onStatusChange(listing.id, status);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-sm leading-snug line-clamp-2">
          {listing.title || listing.location || "Anuncio sin título"}
        </h3>
        <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${STATUS_STYLES[listing.status]}`}>
          {listing.status}
        </span>
      </div>

      <dl className="text-sm space-y-1.5 text-black/70">
        <div className="flex justify-between gap-3">
          <dt className="text-black/40">Ubicación</dt>
          <dd className="text-right font-medium">{listing.location || "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-black/40">Precio venta</dt>
          <dd className="text-right font-semibold text-black">{formatPrice(listing.price)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-black/40">Propietario</dt>
          <dd className="text-right font-medium">{listing.ownerName || "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-black/40">Contacto</dt>
          <dd className="text-right font-medium">{listing.contactPhone || "—"}</dd>
        </div>
      </dl>

      {listing.sourceUrl && (
        <a
          href={listing.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-black/40 hover:text-black underline underline-offset-2"
        >
          Ver anuncio original
        </a>
      )}

      <select
        value={listing.status}
        disabled={updating}
        onChange={(e) => handleStatus(e.target.value as ListingStatus)}
        className="w-full text-xs font-medium border border-black/10 rounded-lg px-2 py-1.5 bg-neutral-50"
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-2 mt-1">
        <button
          onClick={() => setShowAssistant(true)}
          className="py-2.5 rounded-xl bg-black text-white text-xs font-bold tracking-wide hover:bg-black/85 transition-colors"
        >
          Asistente IA
        </button>
        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold tracking-wide text-center hover:brightness-95 transition-all"
          >
            WhatsApp
          </a>
        ) : (
          <button
            disabled
            title="Sin teléfono de contacto"
            className="py-2.5 rounded-xl bg-neutral-200 text-neutral-400 text-xs font-bold tracking-wide cursor-not-allowed"
          >
            WhatsApp
          </button>
        )}
      </div>

      {showAssistant && (
        <AsistenteIAModal message={message} onClose={() => setShowAssistant(false)} />
      )}
    </div>
  );
}
