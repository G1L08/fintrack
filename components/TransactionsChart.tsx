'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { Transaccion } from '@/lib/types';

interface TransactionsChartProps {
  transacciones: Transaccion[];
}

export default function TransactionsChart({ transacciones }: TransactionsChartProps) {
  // Agrupar por día (últimos 7 días)
  const datos = obtenerUltimos7Dias(transacciones);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Ingresos vs Gastos</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Últimos 7 días</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[var(--muted)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Ingresos
          </span>
          <span className="flex items-center gap-1.5 text-[var(--muted)]">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Gastos
          </span>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="dia"
              stroke="var(--muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number) =>
                `$${value.toLocaleString('es-MX', { minimumFractionDigits: 0 })}`
              }
            />
            <Bar dataKey="ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function obtenerUltimos7Dias(transacciones: Transaccion[]) {
  const dias: { dia: string; ingresos: number; gastos: number; fecha: string }[] = [];
  const ahora = new Date();

  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() - i);
    fecha.setHours(0, 0, 0, 0);

    const etiqueta = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    const siguiente = new Date(fecha);
    siguiente.setDate(siguiente.getDate() + 1);

    const delDia = transacciones.filter((t) => {
      const f = new Date(t.fecha);
      return f >= fecha && f < siguiente;
    });

    dias.push({
      dia: etiqueta,
      fecha: fecha.toISOString(),
      ingresos: delDia
        .filter((t) => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.monto, 0),
      gastos: delDia
        .filter((t) => t.tipo === 'gasto')
        .reduce((sum, t) => sum + t.monto, 0),
    });
  }

  return dias;
}