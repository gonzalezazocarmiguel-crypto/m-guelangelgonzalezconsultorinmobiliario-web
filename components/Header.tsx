"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Propiedades", href: "#propiedades" },
    { label: "Servicios", href: "#servicios" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span
              className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${
                scrolled ? "text-black" : "text-white"
              }`}
            >
              novacasa
            </span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[5px] p-2 -mr-2"
            aria-label="Abrir menú"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block transition-all duration-300 ${
                  i === 2 ? "w-4" : "w-6"
                } h-[1.5px] ${scrolled ? "bg-black" : "bg-white"}`}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-[100] bg-black transition-all duration-500 flex flex-col ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16">
          <span className="text-2xl font-black tracking-tighter text-white">novacasa</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white p-2 -mr-2"
            aria-label="Cerrar menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col justify-center flex-1 px-8 gap-2">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-5xl font-black text-white tracking-tighter py-3 border-b border-white/10 hover:pl-4 transition-all duration-200"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="px-8 pb-12">
          <a
            href="#contacto"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center py-4 bg-white text-black text-sm font-bold tracking-widest uppercase"
          >
            Hablar con Miguel Ángel
          </a>
        </div>
      </div>
    </>
  );
}
