'use client';

import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const titulos: Record<string, { titulo: string; subtitulo: string }> = {
  '/': {
    titulo: 'Dashboard',
    subtitulo: 'Resumen de tu situación financiera',
  },
  '/transactions': {
    titulo: 'Transacciones',
    subtitulo: 'Historial de ingresos y gastos',
  },
  '/budgets': {
    titulo: 'Presupuestos',
    subtitulo: 'Control de gastos por categoría',
  },
};

export default function Header() {
  const pathname = usePathname();
  const info = titulos[pathname] ?? {
    titulo: 'Detalle',
    subtitulo: 'Información detallada',
  };

  return (
    <header className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{info.titulo}</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{info.subtitulo}</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}