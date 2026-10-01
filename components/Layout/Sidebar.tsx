'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const enlaces = [
  { href: '/', etiqueta: 'Dashboard', icono: IconoDashboard },
  { href: '/transactions', etiqueta: 'Transacciones', icono: IconoTransacciones },
  { href: '/budgets', etiqueta: 'Presupuestos', icono: IconoPresupuestos },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-[var(--border)] bg-[var(--card)] h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">FinTrack</span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {enlaces.map(({ href, etiqueta, icono: Icono }) => {
          const activo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                activo
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-[var(--muted)] hover:bg-[var(--border)]/50 hover:text-[var(--foreground)]'
              )}
            >
              <Icono className="w-4 h-4" />
              {etiqueta}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--muted)]">v0.1.0</p>
      </div>
    </aside>
  );
}

/* ==================== Iconos SVG ==================== */

function IconoDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function IconoTransacciones({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17l-4-4 4-4" />
      <path d="M3 13h12a4 4 0 0 0 4-4V5" />
      <path d="M17 7l4 4-4 4" />
      <path d="M21 11H9a4 4 0 0 0-4 4v4" />
    </svg>
  );
}

function IconoPresupuestos({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}