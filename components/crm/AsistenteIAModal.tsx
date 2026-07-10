"use client";

import { useState } from "react";

export default function AsistenteIAModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold tracking-tight">Asistente IA · Mensaje sugerido</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-black/40 hover:text-black p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-relaxed bg-neutral-50 border border-black/10 rounded-xl p-4 text-black/80">
          {message}
        </p>

        <button
          onClick={handleCopy}
          className="mt-4 w-full py-3 rounded-xl bg-black text-white text-sm font-semibold tracking-wide hover:bg-black/85 transition-colors"
        >
          {copied ? "Copiado ✓" : "Copiar mensaje"}
        </button>
      </div>
    </div>
  );
}
