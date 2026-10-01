'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useFinStore } from '@/lib/store';
import { categoriaConfig, cn, formatearMonto } from '@/lib/utils';
import type { Categoria, Presupuesto } from '@/lib/types';

interface EditBudgetsModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

const CATEGORIAS_GASTO: Categoria[] = [
  'comida',
  'transporte',
  'vivienda',
  'entretenimiento',
  'salud',
  'educacion',
  'compras',
];

export default function EditBudgetsModal({ abierto, onCerrar }: EditBudgetsModalProps) {
  const presupuestos = useFinStore((s) => s.presupuestos);
  const setPresupuestos = useFinStore((s) => s.setPresupuestos);

  const [valores, setValores] = useState<Record<Categoria, string>>(
    {} as Record<Categoria, string>
  );
  const [metaTotal, setMetaTotal] = useState('');

  // Inicializar cuando abre el modal
  useEffect(() => {
    if (!abierto) return;
    const iniciales = {} as Record<Categoria, string>;
    let suma = 0;
    CATEGORIAS_GASTO.forEach((cat) => {
      const p = presupuestos.find((x) => x.categoria === cat);
      const valor = p ? p.limite : 0;
      iniciales[cat] = String(valor);
      suma += valor;
    });
    setValores(iniciales);
    setMetaTotal(String(suma));
  }, [abierto, presupuestos]);

  function manejarCerrar() {
    onCerrar();
  }

  // Cuando el usuario cambia una categoría, recalcular el total
  function cambiarCategoria(cat: Categoria, valor: string) {
    setValores((v) => {
      const nuevos = { ...v, [cat]: valor };
      const suma = CATEGORIAS_GASTO.reduce((sum, c) => {
        const num = parseFloat(nuevos[c] ?? '0');
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
      setMetaTotal(String(Math.round(suma * 100) / 100));
      return nuevos;
    });
  }

  // Cuando el usuario cambia la meta total, redistribuir proporcionalmente
  function cambiarMetaTotal(valor: string) {
    setMetaTotal(valor);
    const nuevoTotal = parseFloat(valor);
    if (isNaN(nuevoTotal) || nuevoTotal < 0) return;

    // Calcular el total actual de las categorías
    const totalActual = CATEGORIAS_GASTO.reduce((sum, cat) => {
      const num = parseFloat(valores[cat] ?? '0');
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    // Si el total actual es 0, repartir en partes iguales
    if (totalActual === 0) {
      const parteIgual = nuevoTotal / CATEGORIAS_GASTO.length;
      const nuevos = {} as Record<Categoria, string>;
      CATEGORIAS_GASTO.forEach((cat) => {
        nuevos[cat] = String(Math.round(parteIgual * 100) / 100);
      });
      setValores(nuevos);
      return;
    }

    // Redistribuir proporcionalmente
    const nuevos = {} as Record<Categoria, string>;
    CATEGORIAS_GASTO.forEach((cat) => {
      const actual = parseFloat(valores[cat] ?? '0') || 0;
      const proporcion = actual / totalActual;
      const nuevo = nuevoTotal * proporcion;
      nuevos[cat] = String(Math.round(nuevo * 100) / 100);
    });
    setValores(nuevos);
  }

  function manejarGuardar(e: React.FormEvent) {
    e.preventDefault();

    const totalNum = parseFloat(metaTotal);
    if (isNaN(totalNum) || totalNum <= 0) {
      toast.error('La meta total debe ser mayor a 0');
      return;
    }

    for (const cat of CATEGORIAS_GASTO) {
      const v = parseFloat(valores[cat]);
      if (isNaN(v) || v < 0) {
        toast.error(`El límite de "${categoriaConfig[cat].etiqueta}" no es válido`);
        return;
      }
    }

    const nuevos: Presupuesto[] = CATEGORIAS_GASTO.map((cat, idx) => {
      const existente = presupuestos.find((p) => p.categoria === cat);
      return {
        id: existente?.id ?? `pres-${idx}`,
        categoria: cat,
        limite: parseFloat(valores[cat]),
        gastado: existente?.gastado ?? 0,
        periodo: existente?.periodo ?? new Date().toISOString().slice(0, 7),
      };
    });

    setPresupuestos(nuevos);
    toast.success('Presupuestos actualizados');
    onCerrar();
  }

  if (!abierto) return null;

  const totalCategorias = CATEGORIAS_GASTO.reduce((sum, cat) => {
    const v = parseFloat(valores[cat] ?? '0');
    return sum + (isNaN(v) ? 0 : v);
  }, 0);

  const diferencia = parseFloat(metaTotal || '0') - totalCategorias;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={manejarCerrar}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-base font-semibold">Editar presupuestos</h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Define tu meta total y el límite por categoría
            </p>
          </div>
          <button
            onClick={manejarCerrar}
            className="w-7 h-7 rounded-md hover:bg-[var(--border)]/50 transition-colors flex items-center justify-center text-[var(--muted)]"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={manejarGuardar}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            {/* Meta total */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <label className="block text-xs font-medium uppercase tracking-wider text-emerald-400 mb-2">
                Meta total del periodo
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={metaTotal}
                  onChange={(e) => cambiarMetaTotal(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-base font-semibold tabular-nums focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">
                Al cambiarla, se redistribuye proporcionalmente entre las categorías.
              </p>
              {Math.abs(diferencia) > 0.5 && (
                <p className="text-xs text-yellow-400 mt-1">
                  Suma de categorías: {formatearMonto(totalCategorias)} · Diferencia:{' '}
                  {diferencia > 0 ? '+' : ''}
                  {formatearMonto(diferencia)}
                </p>
              )}
            </div>

            {/* Separador */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-xs text-[var(--muted)]">Límite por categoría</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Categorías */}
            <div className="space-y-3">
              {CATEGORIAS_GASTO.map((cat) => {
                const config = categoriaConfig[cat];
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium shrink-0 w-32',
                        config.bg,
                        config.color,
                        config.border
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          config.color.replace('text-', 'bg-')
                        )}
                      />
                      {config.etiqueta}
                    </span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={valores[cat] ?? ''}
                        onChange={(e) => cambiarCategoria(cat, e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm tabular-nums focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--background)]/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--muted)]">Suma de categorías</span>
              <span className="text-sm font-semibold tabular-nums">
                {formatearMonto(totalCategorias)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={manejarCerrar}
                className="flex-1 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--border)]/50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}