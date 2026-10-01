'use client';

import toast from 'react-hot-toast';
import { useFinStore } from '@/lib/store';
import { generarTransaccionesMock } from '@/lib/api';

export default function DemoBanner() {
  const setTransacciones = useFinStore((s) => s.setTransacciones);
  const setPresupuestos = useFinStore((s) => s.setPresupuestos);

  function reiniciar() {
    setTransacciones(generarTransaccionesMock(60));
    setPresupuestos([]);
    toast.success('Datos de demo reiniciados');
  }

  return (
    <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between text-xs shrink-0">
      <div className="flex items-center gap-2 text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium">Modo demo · datos de ejemplo</span>
      </div>
      <button
        onClick={reiniciar}
        className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
      >
        Reiniciar datos
      </button>
    </div>
  );
}
