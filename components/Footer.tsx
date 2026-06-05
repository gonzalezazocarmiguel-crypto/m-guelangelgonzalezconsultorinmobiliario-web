export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-black tracking-tighter text-white">novacasa</span>
        <div className="flex gap-4">
          <a href="#" aria-label="Instagram" className="text-white/30 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn" className="text-white/30 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 text-xs text-white/30 mb-8">
        <div className="space-y-2">
          <p className="text-white/60 font-semibold mb-3">Navegación</p>
          {["Propiedades", "Servicios", "Nosotros", "Contacto"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="block hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-white/60 font-semibold mb-3">Contacto</p>
          <p>+34 600 000 000</p>
          <p>hola@novacasa.es</p>
          <p className="mt-4 leading-relaxed">Calle Ejemplo 1<br />28001 Madrid</p>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 flex flex-col gap-1">
        <p className="text-[10px] text-white/20">
          © 2025 novacasa · Miguel Ángel González · Consultor Inmobiliario
        </p>
        <p className="text-[10px] text-white/10">API Colegiado · Todos los derechos reservados</p>
      </div>
    </footer>
  );
}
