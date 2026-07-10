"use client";

import { useState } from "react";
import type { ApifySettings } from "@/lib/db";

export default function AjustesClient({ initialSettings }: { initialSettings: ApifySettings }) {
  const [apiKey, setApiKey] = useState(initialSettings.apiKey);
  const [actorId, setActorId] = useState(initialSettings.actorId);
  const [inputTemplate, setInputTemplate] = useState(initialSettings.inputTemplate);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/crm/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, actorId, inputTemplate }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo guardar.");
        return;
      }
      setMessage("Ajustes guardados correctamente.");
    } catch {
      setError("Error de red al guardar los ajustes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-1">
        Configuración
      </p>
      <h1 className="text-2xl font-black tracking-tight mb-1">Integración con Apify</h1>
      <p className="text-sm text-black/50 mb-6">
        Estas credenciales se usan para scrapear anuncios de particulares en Madrid desde
        Idealista. Se guardan en el servidor de tu CRM.
      </p>

      <div className="space-y-5 bg-white border border-black/10 rounded-2xl p-6">
        <Field
          label="API Key de Apify"
          hint="La encuentras en tu cuenta de Apify → Settings → Integrations."
        >
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="apify_api_..."
            className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm font-mono"
          />
        </Field>

        <Field
          label="Actor ID"
          hint="Ej: usuario/idealista-scraper, tal como aparece en Apify Store."
        >
          <input
            type="text"
            value={actorId}
            onChange={(e) => setActorId(e.target.value)}
            placeholder="usuario/idealista-scraper"
            className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm font-mono"
          />
        </Field>

        <Field
          label="Input del actor (JSON)"
          hint="Debe incluir la búsqueda filtrada por Madrid y anunciantes particulares (con-particulares). Ajusta los nombres de campo según lo que espere tu actor."
        >
          <textarea
            value={inputTemplate}
            onChange={(e) => setInputTemplate(e.target.value)}
            rows={10}
            className="w-full border border-black/10 rounded-lg px-3 py-2 text-xs font-mono"
          />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-black text-white text-sm font-bold tracking-wide hover:bg-black/85 transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar ajustes"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1">{label}</label>
      {children}
      <p className="text-xs text-black/40 mt-1">{hint}</p>
    </div>
  );
}
