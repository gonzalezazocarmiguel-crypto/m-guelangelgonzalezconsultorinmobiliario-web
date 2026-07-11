export default function DatabaseSetupNotice() {
  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h1 className="text-lg font-black tracking-tight text-amber-900 mb-2">
          Falta conectar la base de datos
        </h1>
        <p className="text-sm text-amber-800 leading-relaxed">
          El CRM necesita una base de datos Postgres para guardar tus captaciones. En el
          panel de tu proyecto en Vercel, ve a <strong>Storage → Create Database → Postgres</strong>{" "}
          y conéctala al proyecto. Vercel configura automáticamente la variable{" "}
          <code className="bg-amber-100 px-1 rounded">DATABASE_URL</code>; solo hace falta
          volver a desplegar (o esperar al siguiente deploy) para que surta efecto.
        </p>
      </div>
    </div>
  );
}
