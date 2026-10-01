'use client';

import { cn, formatearMonto } from '@/lib/utils';

interface BalanceGaugeProps {
  ingresos: number;
  gastos: number;
}

export default function BalanceGauge({ ingresos, gastos }: BalanceGaugeProps) {
  const total = ingresos + gastos;
  const porcentajeIngreso = total > 0 ? (ingresos / total) * 100 : 50;
  const balance = ingresos - gastos;
  const esPositivo = balance >= 0;

  // SVG circle gauge
  const radio = 70;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia - (porcentajeIngreso / 100) * circunferencia;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold">Balance del periodo</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Distribución de ingresos vs gastos
          </p>
        </div>
        <span
          className={cn(
            'text-xs px-2 py-1 rounded-md border',
            esPositivo
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          )}
        >
          {esPositivo ? 'Superávit' : 'Déficit'}
        </span>
      </div>

      <div className="flex items-center gap-8">
        {/* Gauge circular */}
        <div className="relative w-44 h-44 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Fondo */}
            <circle
              cx="80"
              cy="80"
              r={radio}
              fill="none"
              stroke="var(--border)"
              strokeWidth="14"
            />
            {/* Arco de ingresos */}
            <circle
              cx="80"
              cy="80"
              r={radio}
              fill="none"
              stroke="#10b981"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circunferencia}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* Centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-[var(--muted)]">Balance</span>
            <span
              className={cn(
                'text-lg font-semibold tabular-nums mt-0.5',
                esPositivo ? 'text-emerald-400' : 'text-red-400'
              )}
            >
              {esPositivo ? '+' : '−'}
              {formatearMonto(Math.abs(balance))}
            </span>
          </div>
        </div>

        {/* Detalle */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Ingresos
              </span>
              <span className="text-xs text-[var(--muted)] tabular-nums">
                {porcentajeIngreso.toFixed(0)}%
              </span>
            </div>
            <p className="text-sm font-semibold text-emerald-400 tabular-nums">
              {formatearMonto(ingresos)}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Gastos
              </span>
              <span className="text-xs text-[var(--muted)] tabular-nums">
                {(100 - porcentajeIngreso).toFixed(0)}%
              </span>
            </div>
            <p className="text-sm font-semibold text-red-400 tabular-nums">
              {formatearMonto(gastos)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}