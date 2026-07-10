import type { Listing } from "./db";

/** Builds the outreach message from Miguel Ángel's fixed template, filling in the listing data. */
export function buildOutreachMessage(listing: Listing): string {
  const name = listing.ownerName?.trim() || "";
  const size = listing.sizeM2 ? `${listing.sizeM2} m²` : "unos metros que encajan";
  const zone = listing.zone?.trim() || listing.location?.trim() || "tu zona";

  const greeting = name ? `Hola ${name}` : "Hola";

  return `${greeting}, soy Miguel Ángel, personal shopper inmobiliario. Trabajo con una cartera privada de compradores que ya están buscando activamente, y tu propiedad de ${size} en ${zone} encaja con lo que varios de ellos me han pedido. Me gustaría conocer tu situación y ver si encaja con lo que estoy gestionando. Cada operación la llevo yo personalmente, con seguimiento directo y sin intermediarios, y tan seguro estoy del trabajo que hago que, si en 30 días no te presento una oferta seria, te compenso con hasta 3.000€, por escrito y sin letra pequeña. ¿Cuándo te viene bien que te llame para comentarte los detalles? Quedo pendiente, gracias.`;
}

/** Normalizes a phone number to a WhatsApp-compatible international format (default: Spain). */
export function toWhatsappNumber(rawPhone: string): string | null {
  const digits = rawPhone.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("34") && digits.length === 11) return digits;
  if (digits.length === 9) return `34${digits}`;
  return digits;
}

export function buildWhatsappLink(rawPhone: string, message: string): string | null {
  const number = toWhatsappNumber(rawPhone);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
