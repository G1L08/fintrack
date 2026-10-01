'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import TransactionFilters from '@/components/TransactionFilters';
import TransactionCard from '@/components/TransactionCard';
import NewTransactionModal from '@/components/NewTransactionModal';
import EmptyState from '@/components/EmptyState';
import { SkeletonRow } from '@/components/Skeleton';
import { useFinStore } from '@/lib/store';
import { generarTransaccionesMock } from '@/lib/api';

const POR_PAGINA = 10;

export default function TransaccionesPage() {
  const transacciones = useFinStore((s) => s.transacciones);
  const setTransacciones = useFinStore((s) => s.setTransacciones);
  const filtros = useFinStore((s) => s.filtros);
  const [pagina, setPagina] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Cargar datos mock si no hay nada (solo si el tutorial ya se vio)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tutorialVisto = localStorage.getItem('fintrack-tutorial-visto');
    if (tutorialVisto && transacciones.length === 0) {
      // no cargamos nada: respetamos el estado vacío del usuario
    }
  }, [transacciones.length]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPagina(1);
  }, [filtros.categoria, filtros.estado, filtros.busqueda]);

  // Aplicar filtros
  const filtradas = useMemo(() => {
    return transacciones.filter((t) => {
      if (filtros.categoria !== 'todas' && t.categoria !== filtros.categoria) return false;
      if (filtros.estado !== 'todas' && t.estado !== filtros.estado) return false;
      if (
        filtros.busqueda &&
        !t.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase())
      )
        return false;
      return true;
    });
  }, [transacciones, filtros]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + POR_PAGINA);

  const sinTransacciones = transacciones.length === 0;

  function cargarDemo() {
    setTransacciones(generarTransaccionesMock(60));
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Header />
        <main className="p-8 space-y-6">
          {/* Botón nueva transacción */}
          <div className="flex justify-end">
            <button
              onClick={() => setModalAbierto(true)}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-medium"
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
                <path d="M12 5v14M5 12h14" />
              </svg>
              Nueva transacción
            </button>
          </div>

          {sinTransacciones ? (
            <EmptyState
              titulo="No hay transacciones todavía"
              descripcion="Agrega tu primera transacción con el botón de arriba, o carga datos de ejemplo para explorar la app."
              accionTexto="Cargar datos de ejemplo"
              onAccion={cargarDemo}
            />
          ) : (
            <>
              {/* Filtros */}
              <TransactionFilters />

              {/* Lista */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    {filtradas.length} {filtradas.length === 1 ? 'resultado' : 'resultados'}
                  </h3>
                  {filtradas.length > 0 && (
                    <p className="text-xs text-[var(--muted)]">
                      Página {paginaActual} de {totalPaginas}
                    </p>
                  )}
                </div>

                <div>
                  {visibles.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-sm text-[var(--muted)]">
                        No se encontraron transacciones con esos filtros.
                      </p>
                    </div>
                  ) : (
                    visibles.map((t) => <TransactionCard key={t.id} transaccion={t} />)
                  )}
                </div>

                {/* Paginación */}
                {totalPaginas > 1 && (
                  <div className="px-5 py-4 border-t border-[var(--border)] flex items-center justify-between">
                    <button
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={paginaActual === 1}
                      className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--border)]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Anterior
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                        .filter((p) => {
                          if (p === 1 || p === totalPaginas) return true;
                          if (Math.abs(p - paginaActual) <= 1) return true;
                          return false;
                        })
                        .map((p, idx, arr) => {
                          const anterior = arr[idx - 1];
                          const hayGap = anterior && p - anterior > 1;
                          return (
                            <span key={p} className="flex items-center gap-1">
                              {hayGap && (
                                <span className="text-xs text-[var(--muted)]">...</span>
                              )}
                              <button
                                onClick={() => setPagina(p)}
                                className={`text-xs w-7 h-7 rounded-md transition-colors ${
                                  p === paginaActual
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40'
                                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                }`}
                              >
                                {p}
                              </button>
                            </span>
                          );
                        })}
                    </div>

                    <button
                      onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                      disabled={paginaActual === totalPaginas}
                      className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--border)]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <NewTransactionModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
      />
    </div>
  );
}