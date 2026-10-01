'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import BalanceGauge from '@/components/BalanceGauge';
import BudgetTable from '@/components/BudgetTable';
import KPICard from '@/components/KPICard';
import EmptyState from '@/components/EmptyState';
import EditBudgetsModal from '@/components/EditBudgetsModal';
import { useFinStore } from '@/lib/store';
import { generarTransaccionesMock } from '@/lib/api';
import { formatearMonto } from '@/lib/utils';
import type { Presupuesto, Categoria } from '@/lib/types';

const CATEGORIAS_GASTO: Categoria[] = [
  'comida',
  'transporte',
  'vivienda',
  'entretenimiento',
  'salud',
  'educacion',
  'compras',
];

const LIMITES_DEFAULT: Record<Categoria, number> = {
  comida: 6000,
  transporte: 2500,
  vivienda: 12000,
  entretenimiento: 2000,
  salud: 1500,
  educacion: 1000,
  compras: 3000,
  salario: 0,
  freelance: 0,
  inversion: 0,
};

export default function PresupuestosPage() {
  const transacciones = useFinStore((s) => s.transacciones);
  const setTransacciones = useFinStore((s) => s.setTransacciones);
  const presupuestos = useFinStore((s) => s.presupuestos);
  const setPresupuestos = useFinStore((s) => s.setPresupuestos);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Inicializar presupuestos con defaults si están vacíos
  useEffect(() => {
    if (presupuestos.length === 0) {
      const iniciales: Presupuesto[] = CATEGORIAS_GASTO.map((cat, idx) => ({
        id: `pres-${idx}`,
        categoria: cat,
        limite: LIMITES_DEFAULT[cat],
        gastado: 0,
        periodo: new Date().toISOString().slice(0, 7),
      }));
      setPresupuestos(iniciales);
    }
  }, [presupuestos.length, setPresupuestos]);

  // Calcular gastado real desde las transacciones
  const presupuestosConGastado = useMemo(() => {
    return presupuestos.map((p) => ({
      ...p,
      gastado: transacciones
        .filter((t) => t.tipo === 'gasto' && t.categoria === p.categoria)
        .reduce((sum, t) => sum + t.monto, 0),
    }));
  }, [presupuestos, transacciones]);

  const { ingresos, gastos } = useMemo(() => {
    const ing = transacciones
      .filter((t) => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);
    const gas = transacciones
      .filter((t) => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0);
    return { ingresos: ing, gastos: gas };
  }, [transacciones]);

  // KPIs
  const excedidos = presupuestosConGastado.filter((p) => p.gastado >= p.limite).length;
  const enAdvertencia = presupuestosConGastado.filter(
    (p) => p.gastado >= p.limite * 0.8 && p.gastado < p.limite
  ).length;
  const totalPresupuestado = presupuestosConGastado.reduce((sum, p) => sum + p.limite, 0);
  const totalGastado = presupuestosConGastado.reduce((sum, p) => sum + p.gastado, 0);
  const disponible = totalPresupuestado - totalGastado;

  const sinDatos = transacciones.length === 0;

  function cargarDemo() {
    setTransacciones(generarTransaccionesMock(60));
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Header />
        <main className="p-8 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              etiqueta="Presupuestado"
              valor={formatearMonto(totalPresupuestado)}
              detalle={`${presupuestosConGastado.length} categorías · Click para editar`}
              variante="neutral"
              onClick={() => setModalAbierto(true)}
            />
            <KPICard
              etiqueta="Gastado"
              valor={formatearMonto(totalGastado)}
              detalle={
                totalPresupuestado > 0
                  ? `${((totalGastado / totalPresupuestado) * 100).toFixed(0)}% del total`
                  : 'Sin presupuesto aún'
              }
              variante="negativo"
            />
            <KPICard
              etiqueta="Disponible"
              valor={formatearMonto(Math.abs(disponible))}
              detalle={disponible >= 0 ? 'Aún tienes margen' : 'Excedido'}
              variante={disponible >= 0 ? 'positivo' : 'negativo'}
            />
            <KPICard
              etiqueta="Alertas"
              valor={String(excedidos + enAdvertencia)}
              detalle={
                excedidos > 0
                  ? `${excedidos} excedidos, ${enAdvertencia} cerca del límite`
                  : enAdvertencia > 0
                    ? `${enAdvertencia} cerca del límite`
                    : 'Todo en orden'
              }
              variante={
                excedidos > 0 ? 'negativo' : enAdvertencia > 0 ? 'advertencia' : 'positivo'
              }
            />
          </div>

          {sinDatos ? (
            <EmptyState
              titulo="No hay datos para calcular tus presupuestos"
              descripcion="Agrega transacciones o carga datos de ejemplo para ver el progreso contra tus límites."
              accionTexto="Cargar datos de ejemplo"
              onAccion={cargarDemo}
            />
          ) : (
            <>
              <BalanceGauge ingresos={ingresos} gastos={gastos} />
              <BudgetTable presupuestos={presupuestosConGastado} />
            </>
          )}
        </main>
      </div>

      <EditBudgetsModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
      />
    </div>
  );
}