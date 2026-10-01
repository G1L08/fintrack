import { create } from 'zustand';
import type { Transaccion, Presupuesto, Categoria, EstadoTransaccion } from './types';

interface Filtros {
  categoria: Categoria | 'todas';
  estado: EstadoTransaccion | 'todas';
  busqueda: string;
}

interface FinTrackStore {
  transacciones: Transaccion[];
  presupuestos: Presupuesto[];
  filtros: Filtros;
  setTransacciones: (t: Transaccion[]) => void;
  setPresupuestos: (p: Presupuesto[]) => void;
  updatePresupuesto: (categoria: Categoria, limite: number) => void;
  addTransaccion: (t: Omit<Transaccion, 'id'>) => void;
  marcarCompletada: (id: string) => void;
  setFiltro: <K extends keyof Filtros>(clave: K, valor: Filtros[K]) => void;
  resetFiltros: () => void;
}

const filtrosIniciales: Filtros = {
  categoria: 'todas',
  estado: 'todas',
  busqueda: '',
};

export const useFinStore = create<FinTrackStore>((set) => ({
  transacciones: [],
  presupuestos: [],
  filtros: filtrosIniciales,
  setTransacciones: (transacciones) => set({ transacciones }),
  setPresupuestos: (presupuestos) => set({ presupuestos }),
  updatePresupuesto: (categoria, limite) =>
    set((state) => ({
      presupuestos: state.presupuestos.map((p) =>
        p.categoria === categoria ? { ...p, limite } : p
      ),
    })),
  addTransaccion: (nueva) =>
    set((state) => ({
      transacciones: [
        {
          ...nueva,
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        },
        ...state.transacciones,
      ],
    })),
  marcarCompletada: (id) =>
    set((state) => ({
      transacciones: state.transacciones.map((t) =>
        t.id === id ? { ...t, estado: 'completada' as const } : t
      ),
    })),
  setFiltro: (clave, valor) =>
    set((state) => ({
      filtros: { ...state.filtros, [clave]: valor },
    })),
  resetFiltros: () => set({ filtros: filtrosIniciales }),
}));