import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CRM · novacasa",
  description: "Panel de gestión de operaciones inmobiliarias de Miguel Ángel González.",
};

const NAV_SECTIONS = [
  {
    label: "Captaciones",
    href: "/crm/captaciones/anuncios-venta",
    matchPrefix: "/crm/captaciones",
    enabled: true,
  },
  { label: "Clientes", href: "#", matchPrefix: "/crm/clientes", enabled: false },
  { label: "Operaciones", href: "#", matchPrefix: "/crm/operaciones", enabled: false },
  { label: "Agenda", href: "#", matchPrefix: "/crm/agenda", enabled: false },
];

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-60 flex-col border-r border-black/10 bg-white">
          <div className="h-16 flex items-center px-6 border-b border-black/10">
            <Link href="/crm" className="text-lg font-black tracking-tighter">
              novacasa <span className="text-black/40 font-medium text-sm">CRM</span>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1">
            {NAV_SECTIONS.map((section) => (
              <NavItem key={section.label} {...section} />
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-black/10">
            <Link
              href="/crm/ajustes"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-black/60 hover:bg-black/5 hover:text-black transition-colors"
            >
              Ajustes
            </Link>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden h-14 flex items-center justify-between px-4 border-b border-black/10 bg-white">
            <Link href="/crm" className="font-black tracking-tighter">
              novacasa <span className="text-black/40 font-medium text-xs">CRM</span>
            </Link>
            <Link href="/crm/ajustes" className="text-sm font-medium text-black/60">
              Ajustes
            </Link>
          </header>

          <nav className="md:hidden flex overflow-x-auto no-scrollbar gap-1 px-3 py-2 border-b border-black/10 bg-white">
            {NAV_SECTIONS.map((section) => (
              <NavItem key={section.label} {...section} mobile />
            ))}
          </nav>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  label,
  href,
  enabled,
  mobile,
}: {
  label: string;
  href: string;
  matchPrefix: string;
  enabled: boolean;
  mobile?: boolean;
}) {
  if (!enabled) {
    return (
      <span
        className={
          mobile
            ? "flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-black/30 bg-black/5 whitespace-nowrap cursor-not-allowed"
            : "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-black/30 cursor-not-allowed"
        }
        title="Próximamente"
      >
        {label}
        {!mobile && (
          <span className="text-[10px] uppercase tracking-wide bg-black/5 text-black/40 px-1.5 py-0.5 rounded">
            Pronto
          </span>
        )}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={
        mobile
          ? "flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold bg-black text-white whitespace-nowrap"
          : "flex items-center rounded-lg px-3 py-2 text-sm font-semibold bg-black text-white"
      }
    >
      {label}
    </Link>
  );
}
