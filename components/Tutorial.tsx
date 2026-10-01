'use client';

import { useState } from 'react';
import { useFinStore } from '@/lib/store';

const PASOS = [
  {
    titulo: 'Bienvenido a FinTrack',
    descripcion:
      'Un panel para visualizar tus finanzas personales. Vamos a hacer un recorrido rápido con datos de ejemplo para que veas cómo funciona.',
  },
  {
    titulo: 'Dashboard',
    descripcion:
      'Aquí ves tus KPIs: balance, ingresos, gastos y transacciones pendientes. También un gráfico de los últimos 7 días.',
  },
  {
    titulo: 'Transacciones',
    descripcion:
      'En la sección Transacciones puedes ver el historial completo, filtrar por categoría o estado, buscar por descripción y agregar nuevas transacciones manualmente con el botón "+ Nueva transacción".',
  },
  {
    titulo: 'Presupuestos',
    descripcion:
      'Define tu meta total del periodo y el límite de gasto por categoría. Al hacer clic en la tarjeta "Presupuestado" se abre un editor donde puedes ajustar la meta global (se redistribuye proporcionalmente entre las categorías) o modificar cada límite individualmente.',
  },
  {
    titulo: 'Tipos de cambio',
    descripcion:
      'En el dashboard encontrarás tipos de cambio reales (USD a MXN y EUR), actualizados cada hora desde la API pública de Frankfurter.',
  },
  {
    titulo: '¿Listo para empezar?',
    descripcion:
      'Puedes mantener los datos de ejemplo para seguir explorando, o empezar desde cero y agregar tus propias transacciones.',
  },
];

interface TutorialProps {
  onCompletar: (accion: 'mantener' | 'vaciar') => void;
}

export default function Tutorial({ onCompletar }: TutorialProps) {
  const [paso, setPaso] = useState(0);
  const setTransacciones = useFinStore((s) => s.setTransacciones);
  const setPresupuestos = useFinStore((s) => s.setPresupuestos);

  const esUltimo = paso === PASOS.length - 1;
  const actual = PASOS[paso];

  function siguiente() {
    if (esUltimo) return;
    setPaso((p) => p + 1);
  }

  function anterior() {
    if (paso === 0) return;
    setPaso((p) => p - 1);
  }

  function finalizar(accion: 'mantener' | 'vaciar') {
    if (accion === 'vaciar') {
      setTransacciones([]);
      setPresupuestos([]);
    }
    onCompletar(accion);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden">
        {/* Progreso */}
        <div className="h-1 bg-[var(--border)]">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((paso + 1) / PASOS.length) * 100}%` }}
          />
        </div>

        {/* Contenido */}
        <div className="p-8">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400 mb-2">
            Paso {paso + 1} de {PASOS.length}
          </p>
          <h2 className="text-xl font-semibold mb-3">{actual.titulo}</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {actual.descripcion}
          </p>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-[var(--border)] bg-[var(--background)]/40 flex items-center justify-between gap-3">
          <button
            onClick={anterior}
            disabled={paso === 0}
            className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--border)]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          {esUltimo ? (
            <div className="flex gap-2">
              <button
                onClick={() => finalizar('vaciar')}
                className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--border)]/50 transition-colors"
              >
                Empezar desde cero
              </button>
              <button
                onClick={() => finalizar('mantener')}
                className="text-xs px-3 py-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-medium"
              >
                Mantener datos demo
              </button>
            </div>
          ) : (
            <button
              onClick={siguiente}
              className="text-xs px-3 py-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-medium"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}