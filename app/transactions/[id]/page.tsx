'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import CategoryBadge from '@/components/CategoryBadge';
import { useFinStore } from '@/lib/store';
import { generarTransaccionesMock } from '@/lib/api';
import { cn, formatearFecha, formatearMonto } from '@/lib/utils';

export default function DetalleTransaccionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const transacciones = useFinStore((s) => s.transacciones);
  const setTransacciones = useFinStore((s) => s.setTransacciones);
  const marcarCompletada = useFinStore((s) => s.marcarCompletada);

  // Si el store está vacío. regenerar mock
  useEffect(() => {
    if (transacciones.length === 0) {
      setTransacciones(generarTransaccionesMock(60));
    }
  }, [transacciones.length, setTransacciones]);

  const transaccion = useMemo(
    () => transacciones.find((t) => t.id === id),
    [transacciones, id]
  );

  // Historial de eventos mock generado a partir de la transacción
  const historial = useMemo(() => {
    if (!transaccion) return [];
    return [
      {
        id: 'ev-1',
        fecha: transaccion.fecha,
        accion: 'Transacción registrada',
        usuario: 'Sistema',
      },
      {
        id: 'ev-2',
        fecha: new Date(new Date(transaccion.fecha).getTime() + 60_000).toISOString(),
        accion: 'Validación automática completada',
        usuario: 'Sistema',
      },
      ...(transaccion.estado === 'completada'
        ? [
            {
              id: 'ev-3',
              fecha: new Date(new Date(transaccion.fecha).getTime() + 3_600_000).toISOString(),
              accion: 'Marcada como completada',
              usuario: 'Tú',
            },
          ]
        : []),
    ];
  }, [transaccion]);

  // Mientras carga
  if (transacciones.length === 0) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Header />
          <main className="p-8">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8">
              <p className="text-sm text-[var(--muted)]">Cargando transacción...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // No encontrada
  if (!transaccion) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Header />
          <main className="p-8">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
              <p className="text-sm font-medium mb-2">Transacción no encontrada</p>
              <p className="text-xs text-[var(--muted)] mb-6">
                La transacción con ID <span className="font-mono">{id}</span> no existe.
              </p>
              <Link
                href="/transactions"
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--border)]/50 transition-colors"
              >
                Volver a transacciones
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const esIngreso = transaccion.tipo === 'ingreso';

  function manejarCompletar() {
    if (!transaccion) return;
    marcarCompletada(transaccion.id);
    toast.success('Transacción marcada como completada');
  }

  function manejarEliminar() {
    toast.error('Eliminar está deshabilitado en la demo');
  }

  function manejarDuplicar() {
    toast.success('Transacción duplicada (simulado)');
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Header />
        <main className="p-8 space-y-6">
          {/*  Volver */}
          <div>
            <Link
              href="/transactions"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Volver a transacciones
            </Link>
          </div>

          {/* Tarjeta principal */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            {/* Header con monto grande */}
            <div className="p-8 border-b border-[var(--border)]">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center shrink-0',
                      esIngreso ? 'bg-emerald-500/10' : 'bg-red-500/10'
                    )}
                  >
                    {esIngreso ? (
                      <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{transaccion.descripcion}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <CategoryBadge categoria={transaccion.categoria} />
                      <span className="text-xs text-[var(--muted)]">
                        {esIngreso ? 'Ingreso' : 'Gasto'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs text-[var(--muted)] mb-1">Monto</p>
                  <p
                    className={cn(
                      'text-2xl font-semibold tabular-nums',
                      esIngreso ? 'text-emerald-400' : 'text-red-400'
                    )}
                  >
                    {esIngreso ? '+' : '−'}
                    {formatearMonto(transaccion.monto, transaccion.moneda)}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {transaccion.moneda}
                  </p>
                </div>
              </div>
            </div>

            {/* Datos */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                  Estado
                </p>
                <div className="mt-2">
                  {transaccion.estado === 'completada' ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Completada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm text-yellow-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      Pendiente
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                  Fecha
                </p>
                <p className="mt-2 text-sm">{formatearFecha(transaccion.fecha)}</p>
              </div>

              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                  ID
                </p>
                <p className="mt-2 text-sm font-mono text-[var(--muted)]">
                  {transaccion.id}
                </p>
              </div>
            </div>
          </div>

          {/* barra inferior: Historial + Acciones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Historial */}
            <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold">Historial de eventos</h3>
              </div>
              <div>
                {historial.map((evento, idx) => (
                  <div
                    key={evento.id}
                    className="flex items-start gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0"
                  >
                    {/* Tiempo dot */}
                    <div className="relative flex flex-col items-center shrink-0 pt-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      {idx < historial.length - 1 && (
                        <div className="absolute top-4 w-px h-10 bg-[var(--border)]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{evento.accion}</p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        {formatearFecha(evento.fecha)} · {evento.usuario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Eventos  */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold">Acciones</h3>
              </div>
              <div className="p-5 space-y-2">
                {transaccion.estado === 'pendiente' && (
                  <button
                    onClick={manejarCompletar}
                    className="w-full text-left text-sm px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    Marcar como completada
                  </button>
                )}

                <button
                  onClick={manejarDuplicar}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--border)]/50 transition-colors"
                >
                  Duplicar transacción
                </button>

                <button
                  onClick={() => router.push('/transactions')}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--border)]/50 transition-colors"
                >
                  Volver al listado
                </button>

                <button
                  onClick={manejarEliminar}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Eliminar transacción
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}