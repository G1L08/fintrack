import type { TipoCambio, Transaccion } from './types';

// Tipos de cambio

export async function obtenerTiposCambio(
  base: string = 'USD',
  destinos: string[] = ['MXN', 'EUR']
): Promise<TipoCambio> {
  const url = `https://api.frankfurter.app/latest?from=${base}&to=${destinos.join(',')}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Error al obtener tipos de cambio');
  const data = await res.json();
  return {
    base: data.base,
    fecha: data.date,
    tasas: data.rates,
  };
}

// Transaccion

const categoriasGasto = ['comida', 'transporte', 'vivienda', 'entretenimiento', 'salud', 'educacion', 'compras'] as const;
const categoriasIngreso = ['salario', 'freelance', 'inversion'] as const;

const descripcionesGasto = [
  'Supermercado semanal',
  'Gasolina',
  'Renta del departamento',
  'Cine con amigos',
  'Consulta médica',
  'Curso online',
  'Ropa nueva',
  'Café por la mañana',
  'Uber al trabajo',
  'Internet mensual',
];

const descripcionesIngreso = [
  'Salario mensual',
  'Proyecto freelance',
  'Dividendos',
  'Venta de producto',
];

export function generarTransaccionesMock(cantidad: number = 30): Transaccion[] {
  const transacciones: Transaccion[] = [];
  const ahora = Date.now();

  for (let i = 0; i < cantidad; i++) {
    const esIngreso = Math.random() < 0.25;
    const categoria = esIngreso
      ? categoriasIngreso[Math.floor(Math.random() * categoriasIngreso.length)]
      : categoriasGasto[Math.floor(Math.random() * categoriasGasto.length)];

    const descripcion = esIngreso
      ? descripcionesIngreso[Math.floor(Math.random() * descripcionesIngreso.length)]
      : descripcionesGasto[Math.floor(Math.random() * descripcionesGasto.length)];

    const monto = esIngreso
      ? Math.round((3000 + Math.random() * 15000) * 100) / 100
      : Math.round((50 + Math.random() * 1500) * 100) / 100;

    const haceMinutos = Math.floor(Math.random() * 60 * 24 * 30);

    transacciones.push({
      id: `tx-${i + 1}`,
      tipo: esIngreso ? 'ingreso' : 'gasto',
      categoria,
      monto,
      moneda: 'MXN',
      descripcion,
      fecha: new Date(ahora - haceMinutos * 60000).toISOString(),
      estado: Math.random() < 0.85 ? 'completada' : 'pendiente',
    });
  }

  return transacciones.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}