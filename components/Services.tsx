const services = [
  {
    n: "01",
    title: "Compra & Venta",
    desc: "Valoración, negociación y gestión integral de tu operación inmobiliaria.",
  },
  {
    n: "02",
    title: "Alquiler",
    desc: "Selección de inquilinos, contratos y administración mensual sin complicaciones.",
  },
  {
    n: "03",
    title: "Valoración gratuita",
    desc: "Conoce el valor real de tu inmueble con un estudio de mercado personalizado.",
  },
  {
    n: "04",
    title: "Inversión",
    desc: "Identificamos activos con alto potencial de rentabilidad según tu perfil.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-black text-white">
      <div className="px-5 pt-20 pb-8">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-white/30 uppercase mb-2">
          Lo que ofrecemos
        </p>
        <h2 className="text-4xl font-black tracking-tighter leading-none mb-12">
          SERVI-
          <br />
          CIOS.
        </h2>

        <div className="space-y-0">
          {services.map((s, i) => (
            <div
              key={s.n}
              className={`py-7 border-t border-white/10 ${i === services.length - 1 ? "border-b" : ""}`}
            >
              <div className="flex gap-5">
                <span className="text-[11px] font-semibold text-white/20 mt-0.5 w-6 flex-shrink-0">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-lg font-bold mb-1.5">{s.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
                </div>
                <div className="ml-auto self-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M8 3l5 5-5 5" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <a
          href="#contacto"
          className="block w-full text-center py-4 mt-10 bg-white text-black text-xs font-black tracking-[0.2em] uppercase"
        >
          Solicitar información
        </a>
      </div>
    </section>
  );
}
