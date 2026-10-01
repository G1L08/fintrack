'use client';

import { categoriaConfig, cn, formatearMonto, calcularEstadoPresupuesto, presupuestoConfig } from '@/lib/utils';
import type { Presupuesto } from '@/lib/types';

interface BudgetTableProps {
  presupuestos: Presupuesto[];
}

export default function BudgetTable({ presupuestos }: BudgetTableProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Cabecerass */}
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold">Presupuestos por categoría</h3>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Control de gastos del periodo actual
        </p>
      </div>

      {/* Columnas */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-[var(--border)] bg-[var(--background)]/40">
        <div className="col-span-3 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Categoría
        </div>
        <div className="col-span-4 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Progreso
        </div>
        <div className="col-span-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)] text-right">
          Gastado
        </div>
        <div className="col-span-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)] text-right">
          Límite
        </div>
        <div className="col-span-1 text-xs font-medium uppercase tracking-wider text-[var(--muted)] text-right">
          Estado
        </div>
      </div>

      {/* Filas */}
      <div>
        {presupuestos.map((p) => {
          const config = categoriaConfig[p.categoria];
          const estado = calcularEstadoPresupuesto(p.gastado, p.limite);
          const estadoConfig = presupuestoConfig[estado];
          const porcentaje = Math.min(100, (p.gastado / p.limite) * 100);

          const barraColor =
            estado === 'excedido'
              ? 'bg-red-500'
              : estado === 'advertencia'
                ? 'bg-yellow-500'
                : 'bg-emerald-500';

          return (
            <div
              key={p.id}
              className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/20 transition-colors items-center"
            >
              {/* Categoría */}
              <div className="col-span-12 md:col-span-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
                    config.bg,
                    config.color,
                    config.border
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full', config.color.replace('text-', 'bg-'))} />
                  {config.etiqueta}
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="col-span-12 md:col-span-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[var(--border)] overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', barraColor)}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--muted)] tabular-nums w-10 text-right">
                    {porcentaje.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Gastado */}
              <div className="col-span-4 md:col-span-2 text-right">
                <span className="text-sm font-medium tabular-nums">
                  {formatearMonto(p.gastado)}
                </span>
              </div>

              {/* Límite */}
              <div className="col-span-4 md:col-span-2 text-right">
                <span className="text-sm text-[var(--muted)] tabular-nums">
                  {formatearMonto(p.limite)}
                </span>
              </div>

              {/* Estado */}
              <div className="col-span-4 md:col-span-1 text-right">
                <span className={cn('text-xs', estadoConfig.color)}>
                  {estadoConfig.etiqueta}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}