'use client';

import { useEffect, useState } from 'react';
import ExchangeRates from '@/components/ExchangeRates';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import KPICard from '@/components/KPICard';
import TransactionCard from '@/components/TransactionCard';
import TransactionsChart from '@/components/TransactionsChart';
import EmptyState from '@/components/EmptyState';
import Tutorial from '@/components/Tutorial';
import NewTransactionModal from '@/components/NewTransactionModal';
import { useFinStore } from '@/lib/store';
import { generarTransaccionesMock } from '@/lib/api';
import { formatearMonto } from '@/lib/utils';

export default function Home() {
  const transacciones = useFinStore((s) => s.transacciones);
  const setTransacciones = useFinStore((s) => s.setTransacciones);

  const [mostrarTutorial, setMostrarTutorial] = useState(false);
  const [montado, setMontado] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    setMontado(true);
    const visto = localStorage.getItem('fintrack-tutorial-visto');
    if (!visto) {
      setTransacciones(generarTransaccionesMock(40));
      setMostrarTutorial(true);
    }
  }, [setTransacciones]);

  function completarTutorial() {
    localStorage.setItem('fintrack-tutorial-visto', 'true');
    setMostrarTutorial(false);
  }

  function cargarDemo() {
    setTransacciones(generarTransaccionesMock(40));
  }

  const ingresos = transacciones
    .filter((t) => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const gastos = transacciones
    .filter((t) => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const balance = ingresos - gastos;
  const pendientes = transacciones.filter((t) => t.estado === 'pendiente').length;

  const vacia = montado && transacciones.length === 0;
  const ultimas = transacciones.slice(0, 5);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Header />
        <main className="p-8 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              etiqueta="Balance"
              valor={formatearMonto(balance)}
              detalle={balance >= 0 ? 'Superávit del periodo' : 'Déficit del periodo'}
              variante={balance >= 0 ? 'positivo' : 'negativo'}
            />
            <KPICard
              etiqueta="Ingresos"
              valor={formatearMonto(ingresos)}
              detalle={`${transacciones.filter((t) => t.tipo === 'ingreso').length} transacciones`}
              variante="positivo"
            />
            <KPICard
              etiqueta="Gastos"
              valor={formatearMonto(gastos)}
              detalle={`${transacciones.filter((t) => t.tipo === 'gasto').length} transacciones`}
              variante="negativo"
            />
            <KPICard
              etiqueta="Pendientes"
              valor={String(pendientes)}
              detalle={pendientes === 0 ? 'Todo al día' : 'Requieren atención'}
              variante={pendientes > 0 ? 'advertencia' : 'neutral'}
            />
          </div>

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

          {/* Vista vacía o con datos */}
          {vacia ? (
            <EmptyState
              titulo="Aún no tienes transacciones"
              descripcion="Agrega tu primera transacción o carga datos de ejemplo para explorar el panel."
              accionTexto="Cargar datos de ejemplo"
              onAccion={cargarDemo}
            />
          ) : (
            <>
              <TransactionsChart transacciones={transacciones} />
              <ExchangeRates />
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Últimas transacciones</h3>
                  <a
                    href="/transactions"
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Ver todas
                  </a>
                </div>
                <div>
                  {ultimas.map((t) => (
                    <TransactionCard key={t.id} transaccion={t} />
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {mostrarTutorial && <Tutorial onCompletar={completarTutorial} />}
      <NewTransactionModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
      />
    </div>
  );
}