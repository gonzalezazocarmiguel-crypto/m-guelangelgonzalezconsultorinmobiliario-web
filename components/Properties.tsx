const properties = [
  {
    id: 1,
    type: "Ático",
    title: "Penthouse vista panorámica",
    location: "Centro Histórico",
    price: "€485.000",
    beds: 3,
    area: 145,
    tag: "Exclusivo",
  },
  {
    id: 2,
    type: "Villa",
    title: "Villa con jardín privado",
    location: "Zona Norte",
    price: "€890.000",
    beds: 5,
    area: 320,
    tag: "Nuevo",
  },
  {
    id: 3,
    type: "Loft",
    title: "Loft de diseño reformado",
    location: "Barrio Moderno",
    price: "€275.000",
    beds: 2,
    area: 85,
    tag: null,
  },
  {
    id: 4,
    type: "Chalet",
    title: "Chalet con terraza amplia",
    location: "Urb. Las Palmas",
    price: "€620.000",
    beds: 4,
    area: 210,
    tag: "Oportunidad",
  },
];

export default function Properties() {
  return (
    <section id="propiedades" className="bg-white">
      {/* Section header */}
      <div className="px-5 pt-20 pb-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-black/30 uppercase mb-2">
            Portafolio
          </p>
          <h2 className="text-4xl font-black tracking-tighter leading-none">
            PROPIE-
            <br />
            DADES.
          </h2>
        </div>
        <a href="#contacto" className="text-xs font-bold underline underline-offset-4 self-end pb-1">
          Ver todas →
        </a>
      </div>

      {/* Cards — horizontal scroll on mobile */}
      <div className="flex gap-4 overflow-x-auto px-5 pb-8 snap-x snap-mandatory no-scrollbar">
        {properties.map((p) => (
          <div
            key={p.id}
            className="flex-none w-[78vw] max-w-xs snap-start"
          >
            {/* Image area */}
            <div className="relative h-64 bg-black overflow-hidden">
              {/* Architectural gradient stand-in */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-600 to-black" />
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Big property type text */}
              <div className="absolute inset-0 flex items-center justify-center select-none">
                <span className="text-white/5 font-black text-7xl tracking-tighter uppercase">
                  {p.type}
                </span>
              </div>
              {/* Tag */}
              {p.tag && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-white text-black text-[9px] font-black tracking-widest uppercase">
                  {p.tag}
                </span>
              )}
              {/* Price overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <span className="text-white text-xl font-black tracking-tight">{p.price}</span>
                <span className="text-white/50 text-[10px]">{p.area} m²</span>
              </div>
            </div>

            {/* Info */}
            <div className="pt-4 border-b border-black/10 pb-4">
              <p className="text-[10px] text-black/40 uppercase tracking-widest mb-1">
                {p.type} · {p.location}
              </p>
              <h3 className="text-base font-bold leading-tight mb-3">{p.title}</h3>
              <div className="flex gap-4 text-[11px] text-black/50">
                <span>{p.beds} hab.</span>
                <span>{p.area} m²</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint dots */}
      <div className="flex justify-center gap-1.5 pb-8">
        {properties.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all ${i === 0 ? "w-4 h-1 bg-black" : "w-1 h-1 bg-black/20"}`}
          />
        ))}
      </div>
    </section>
  );
}
