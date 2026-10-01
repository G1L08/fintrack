export type TipoTransaccion = 'ingreso' | 'gasto';
export type EstadoTransaccion = 'pendiente' | 'completada';

export type Categoria =
  | 'comida'
  | 'transporte'
  | 'vivienda'
  | 'entretenimiento'
  | 'salud'
  | 'educacion'
  | 'compras'
  | 'salario'
  | 'freelance'
  | 'inversion';

export type Moneda = 'MXN' | 'USD' | 'EUR';
export type EstadoPresupuesto = 'ok' | 'advertencia' | 'excedido';

export interface EventoTransaccion {
  id: string;
  fecha: string;
  accion: string;
  usuario: string;
}

export interface Transaccion {
  id: string;
  tipo: TipoTransaccion;
  categoria: Categoria;
  monto: number;
  moneda: Moneda;
  descripcion: string;
  fecha: string;
  estado: EstadoTransaccion;
  historial?: EventoTransaccion[];
  notas?: string;
}

export interface Presupuesto {
  id: string;
  categoria: Categoria;
  limite: number;
  gastado: number;
  periodo: string;
}

export interface TipoCambio {
  base: string;
  fecha: string;
  tasas: Record<string, number>;
}

export interface MonedaFavorita {
  codigo: Moneda;
  nombre: string;
  simbolo: string;
  tasaActual: number;
}