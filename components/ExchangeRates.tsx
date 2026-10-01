'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from './Skeleton';

interface Tasas {
  base: string;
  fecha: string;
  tasas: Record<string, number>;
}

const monedas: Record<string, { nombre: string; simbolo: string }> = {
  MXN: { nombre: 'Peso mexicano', simbolo: '$' },
  EUR: { nombre: 'Euro', simbolo: '€' },
};

export default function ExchangeRates() {
  const [datos, setDatos] = useState<Tasas | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/rates')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error();
        setDatos(data);
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, []);

  // Loading
  if (cargando) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  // Error
  if (error || !datos) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Tipos de cambio
        </p>
        <p className="text-sm text-red-400 mt-2">
          No se pudieron cargar las tasas
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Tipos de cambio</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Base {datos.base} · {datos.fecha}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          En vivo
        </span>
      </div>

      <div className="space-y-3">
        {Object.entries(datos.tasas).map(([codigo, valor]) => {
          const meta = monedas[codigo];
          return (
            <div
              key={codigo}
              className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
            >
              <div>
                <p className="text-sm font-medium">
                  1 {datos.base} = {valor.toFixed(4)} {codigo}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {meta?.nombre ?? codigo}
                </p>
              </div>
              <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
                {meta?.simbolo}
                {valor.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}