"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nombre: "", telefono: "", mensaje: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contacto" className="bg-black text-white">
      <div className="px-5 pt-20 pb-24">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-white/30 uppercase mb-2">
          Hablemos
        </p>
        <h2 className="text-4xl font-black tracking-tighter leading-none mb-2">
          CONTACTO.
        </h2>
        <p className="text-white/40 text-sm mb-10">
          Respuesta en menos de 24 horas.
        </p>

        {sent ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-xl font-bold mb-2">¡Mensaje enviado!</p>
            <p className="text-white/50 text-sm">Me pondré en contacto contigo muy pronto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-4 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                required
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-4 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="+34 600 000 000"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2">
                ¿En qué te puedo ayudar?
              </label>
              <textarea
                rows={4}
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-4 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors resize-none"
                placeholder="Cuéntame sobre la propiedad o lo que buscas..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-white text-black text-xs font-black tracking-[0.2em] uppercase mt-2 active:scale-95 transition-transform"
            >
              Enviar mensaje
            </button>
          </form>
        )}

        {/* Direct contact */}
        <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
          <a
            href="tel:+34600000000"
            className="flex items-center gap-4 py-3 border-b border-white/5"
          >
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 16.72V20a2 2 0 01-2 2h-1C9.716 22 3 15.284 3 7V5z"/>
              </svg>
            </div>
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest">Llamar ahora</div>
              <div className="text-sm font-bold">+34 600 000 000</div>
            </div>
          </a>
          <a
            href="https://wa.me/34600000000"
            className="flex items-center gap-4 py-3"
          >
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest">WhatsApp</div>
              <div className="text-sm font-bold">Escribir ahora</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
