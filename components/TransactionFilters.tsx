'use client';

import { useFinStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { Categoria, EstadoTransaccion } from '@/lib/types';
import { categoriaConfig } from '@/lib/utils';

const categorias: (Categoria | 'todas')[] = [
  'todas',
  'comida',
  'transporte',
  'vivienda',
  'entretenimiento',
  'salud',
  'educacion',
  'compras',
  'salario',
  'freelance',
  'inversion',
];

const estados: { valor: EstadoTransaccion | 'todas'; etiqueta: string }[] = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'completada', etiqueta: 'Completadas' },
  { valor: 'pendiente', etiqueta: 'Pendientes' },
];

export default function TransactionFilters() {
  const filtros = useFinStore((s) => s.filtros);
  const setFiltro = useFinStore((s) => s.setFiltro);
  const resetFiltros = useFinStore((s) => s.resetFiltros);

  const hayFiltrosActivos =
    filtros.categoria !== 'todas' ||
    filtros.estado !== 'todas' ||
    filtros.busqueda !== '';

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-4">
      {/* Búsqueda */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={filtros.busqueda}
          onChange={(e) => setFiltro('busqueda', e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      {/* Fila inferior: categorías + estado + reset */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Categorías */}
        <div className="flex flex-wrap gap-1.5">
          {categorias.map((cat) => {
            const activa = filtros.categoria === cat;
            const etiqueta =
              cat === 'todas' ? 'Todas las categorías' : categoriaConfig[cat].etiqueta;

            return (
              <button
                key={cat}
                onClick={() => setFiltro('categoria', cat)}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-md border transition-colors',
                  activa
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)]'
                )}
              >
                {etiqueta}
              </button>
            );
          })}
        </div>

        {/* Separador */}
        <div className="h-6 w-px bg-[var(--border)]" />

        {/* Estado */}
        <div className="flex gap-1.5">
          {estados.map(({ valor, etiqueta }) => {
            const activa = filtros.estado === valor;
            return (
              <button
                key={valor}
                onClick={() => setFiltro('estado', valor)}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-md border transition-colors',
                  activa
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)]'
                )}
              >
                {etiqueta}
              </button>
            );
          })}
        </div>

        {/* Reset */}
        {hayFiltrosActivos && (
          <button
            onClick={resetFiltros}
            className="ml-auto text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}