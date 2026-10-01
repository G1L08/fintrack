'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import CategoryBadge from './CategoryBadge';
import { useFinStore } from '@/lib/store';
import { cn, formatearMonto, formatearRelativo } from '@/lib/utils';
import type { Transaccion } from '@/lib/types';

interface TransactionCardProps {
  transaccion: Transaccion;
}

export default function TransactionCard({ transaccion }: TransactionCardProps) {
  const marcarCompletada = useFinStore((s) => s.marcarCompletada);
  const esIngreso = transaccion.tipo === 'ingreso';

  function manejarCompletar(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    marcarCompletada(transaccion.id);
    toast.success('Transacción marcada como completada');
  }

  return (
    <Link
      href={`/transactions/${transaccion.id}`}
      className="flex items-center gap-4 p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/20 transition-colors"
    >
      {/* Indicador tipo */}
      <div
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          esIngreso ? 'bg-emerald-500/10' : 'bg-red-500/10'
        )}
      >
        {esIngreso ? (
          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        )}
      </div>

      {/* Descripción y categoría */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{transaccion.descripcion}</p>
        <div className="flex items-center gap-2 mt-1">
          <CategoryBadge categoria={transaccion.categoria} />
          <span className="text-xs text-[var(--muted)]">
            {formatearRelativo(transaccion.fecha)}
          </span>
        </div>
      </div>

      {/* Estado */}
      {transaccion.estado === 'pendiente' && (
        <button
          onClick={manejarCompletar}
          className="text-xs px-2.5 py-1 rounded-md border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors shrink-0"
        >
          Marcar completada
        </button>
      )}
      {transaccion.estado === 'completada' && (
        <span className="text-xs text-[var(--muted)] shrink-0">Completada</span>
      )}

      {/* Monto */}
      <div className="text-right shrink-0">
        <p
          className={cn(
            'text-sm font-semibold tabular-nums',
            esIngreso ? 'text-emerald-400' : 'text-[var(--foreground)]'
          )}
        >
          {esIngreso ? '+' : '−'}
          {formatearMonto(transaccion.monto, transaccion.moneda)}
        </p>
      </div>
    </Link>
  );
}