"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const y = window.scrollY;
        bgRef.current.style.transform = `translateY(${y * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-black flex flex-col justify-end">
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ top: "-20%" }}
      >
        {/* Gradient panels simulating a building/architecture image */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black" />
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Architectural lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[20, 40, 60, 80].map((pos) => (
            <div
              key={pos}
              className="absolute top-0 bottom-0 w-px bg-white/5"
              style={{ left: `${pos}%` }}
            />
          ))}
          {[30, 50, 70].map((pos) => (
            <div
              key={pos}
              className="absolute left-0 right-0 h-px bg-white/5"
              style={{ top: `${pos}%` }}
            />
          ))}
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

      {/* Big background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span
          className="text-white font-black tracking-tighter leading-none opacity-[0.04]"
          style={{ fontSize: "clamp(100px, 35vw, 400px)" }}
        >
          NC
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 pb-20">
        <p className="text-white/40 text-[10px] font-semibold tracking-[0.3em] uppercase mb-4">
          Consultor Inmobiliario
        </p>

        <h1 className="text-white font-black tracking-tighter leading-[0.95] mb-8"
          style={{ fontSize: "clamp(52px, 16vw, 80px)" }}>
          ENCUENTRA
          <br />
          <span className="text-white/50">TU PRÓXIMO</span>
          <br />
          HOGAR.
        </h1>

        <div className="flex flex-col gap-3">
          <a
            href="#propiedades"
            className="block w-full text-center py-4 bg-white text-black text-xs font-black tracking-[0.2em] uppercase"
          >
            Ver propiedades
          </a>
          <a
            href="#contacto"
            className="block w-full text-center py-4 border border-white/30 text-white text-xs font-semibold tracking-[0.2em] uppercase"
          >
            Asesoría gratuita
          </a>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
          {[
            { n: "+200", label: "Vendidas" },
            { n: "12+", label: "Años exp." },
            { n: "98%", label: "Satisfacción" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-black text-white">{s.n}</div>
              <div className="text-[10px] text-white/40 mt-0.5 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
