export default function About() {
  return (
    <section id="nosotros" className="bg-white">
      <div className="px-5 pt-20 pb-20">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-black/30 uppercase mb-2">
          Quién soy
        </p>

        {/* Big name */}
        <div className="mb-10 overflow-hidden">
          <h2
            className="font-black tracking-tighter text-black leading-none"
            style={{ fontSize: "clamp(36px, 12vw, 64px)" }}
          >
            MIGUEL
            <br />
            ÁNGEL
            <br />
            <span className="text-black/20">GONZÁLEZ.</span>
          </h2>
        </div>

        {/* Photo stand-in */}
        <div className="relative w-full aspect-[4/5] bg-black mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-neutral-700" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/5 font-black text-[120px] tracking-tighter">MA</span>
          </div>
          <div className="absolute bottom-6 left-5 right-5">
            <p className="text-white text-lg font-bold">Consultor Inmobiliario</p>
            <p className="text-white/50 text-sm">+12 años de experiencia</p>
          </div>
        </div>

        <p className="text-base leading-relaxed text-black/60 mb-6">
          Especialista en el mercado inmobiliario con más de 12 años conectando
          personas con su hogar ideal. Mi enfoque combina análisis de mercado
          riguroso con atención personalizada.
        </p>

        <p className="text-base leading-relaxed text-black/60 mb-10">
          Cada operación es única. Por eso dedico el tiempo necesario para
          entender tus necesidades y encontrar la solución perfecta.
        </p>

        {/* Credentials */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "🏛", text: "API Colegiado" },
            { icon: "📍", text: "Experto zona local" },
            { icon: "🤝", text: "Negociación directa" },
            { icon: "📊", text: "Análisis de mercado" },
          ].map((c) => (
            <div key={c.text} className="border border-black/10 px-4 py-3 flex items-center gap-3">
              <span className="text-lg">{c.icon}</span>
              <span className="text-xs font-semibold">{c.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
