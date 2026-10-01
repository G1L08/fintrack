'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useFinStore } from '@/lib/store';
import { categoriaConfig, cn } from '@/lib/utils';
import type { Categoria, TipoTransaccion, Moneda } from '@/lib/types';

interface NewTransactionModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

const categoriasGasto: Categoria[] = [
  'comida',
  'transporte',
  'vivienda',
  'entretenimiento',
  'salud',
  'educacion',
  'compras',
];

const categoriasIngreso: Categoria[] = ['salario', 'freelance', 'inversion'];

const monedas: Moneda[] = ['MXN', 'USD', 'EUR'];

export default function NewTransactionModal({
  abierto,
  onCerrar,
}: NewTransactionModalProps) {
  const addTransaccion = useFinStore((s) => s.addTransaccion);

  const [tipo, setTipo] = useState<TipoTransaccion>('gasto');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('comida');
  const [moneda, setMoneda] = useState<Moneda>('MXN');

  const categoriasDisponibles =
    tipo === 'gasto' ? categoriasGasto : categoriasIngreso;

  function cambiarTipo(nuevo: TipoTransaccion) {
    setTipo(nuevo);
    setCategoria(nuevo === 'gasto' ? 'comida' : 'salario');
  }

  function limpiar() {
    setTipo('gasto');
    setDescripcion('');
    setMonto('');
    setCategoria('comida');
    setMoneda('MXN');
  }

  function manejarCerrar() {
    limpiar();
    onCerrar();
  }

  function manejarGuardar(e: React.FormEvent) {
    e.preventDefault();

    const montoNum = parseFloat(monto);
    if (!descripcion.trim()) {
      toast.error('Escribe una descripción');
      return;
    }
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      toast.error('Ingresa un monto válido mayor a 0');
      return;
    }

    addTransaccion({
      tipo,
      categoria,
      monto: montoNum,
      moneda,
      descripcion: descripcion.trim(),
      fecha: new Date().toISOString(),
      estado: 'completada',
    });

    toast.success('Transacción agregada');
    limpiar();
    onCerrar();
  }

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={manejarCerrar}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold">Nueva transacción</h2>
          <button
            onClick={manejarCerrar}
            className="w-7 h-7 rounded-md hover:bg-[var(--border)]/50 transition-colors flex items-center justify-center text-[var(--muted)]"
            aria-label="Cerrar"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={manejarGuardar} className="p-6 space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => cambiarTipo('gasto')}
                className={cn(
                  'py-2 rounded-lg border text-sm font-medium transition-colors',
                  tipo === 'gasto'
                    ? 'border-red-500/40 bg-red-500/10 text-red-400'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)]'
                )}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => cambiarTipo('ingreso')}
                className={cn(
                  'py-2 rounded-lg border text-sm font-medium transition-colors',
                  tipo === 'ingreso'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)]'
                )}
              >
                Ingreso
              </button>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej. Supermercado semanal"
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Monto y Moneda */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-2">
              Monto
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-emerald-500/50 transition-colors tabular-nums"
              />
              <select
                value={moneda}
                onChange={(e) => setMoneda(e.target.value as Moneda)}
                className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              >
                {monedas.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-2">
              Categoría
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categoriasDisponibles.map((cat) => {
                const config = categoriaConfig[cat];
                const activa = categoria === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoria(cat)}
                    className={cn(
  'text-xs px-2.5 py-1 rounded-md border transition-colors',
  activa
    ? `${config.bg} ${config.color} ${config.border}`
    : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)]'
)}
                  >
                    {config.etiqueta}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2 pt-2">
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
        </form>
      </div>
    </div>
  );
}