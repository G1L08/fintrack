import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Categoria, EstadoPresupuesto, Moneda } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fecha

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatearFechaCorta(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
  });
}

export function formatearRelativo(iso: string): string {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return 'hace un momento';
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH} h`;
  return `hace ${Math.floor(diffH / 24)} d`;
}

// Formatos de dinero

const simbolosMoneda: Record<Moneda, string> = {
  MXN: '$',
  USD: 'US$',
  EUR: '€',
};

export function formatearMonto(monto: number, moneda: Moneda = 'MXN'): string {
  const simbolo = simbolosMoneda[moneda];
  const formateado = Math.abs(monto).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${simbolo}${formateado}`;
}

// Categorias

export const categoriaConfig: Record<
  Categoria,
  { etiqueta: string; emoji: string; color: string; bg: string }
> = {
  comida: { etiqueta: 'Comida', emoji: '🍔', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  transporte: { etiqueta: 'Transporte', emoji: '🚗', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  vivienda: { etiqueta: 'Vivienda', emoji: '🏠', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  entretenimiento: { etiqueta: 'Entretenimiento', emoji: '🎬', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  salud: { etiqueta: 'Salud', emoji: '💊', color: 'text-red-400', bg: 'bg-red-500/10' },
  educacion: { etiqueta: 'Educación', emoji: '📚', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  compras: { etiqueta: 'Compras', emoji: '🛍️', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  salario: { etiqueta: 'Salario', emoji: '💼', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  freelance: { etiqueta: 'Freelance', emoji: '💻', color: 'text-teal-400', bg: 'bg-teal-500/10' },
  inversion: { etiqueta: 'Inversión', emoji: '📈', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
};

// Presupuesto
export const presupuestoConfig: Record<
  EstadoPresupuesto,
  { etiqueta: string; color: string; bg: string }
> = {
  ok: { etiqueta: 'En orden', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  advertencia: { etiqueta: 'Cerca del límite', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  excedido: { etiqueta: 'Excedido', color: 'text-red-400', bg: 'bg-red-500/10' },
};

export function calcularEstadoPresupuesto(gastado: number, limite: number): EstadoPresupuesto {
  const porcentaje = gastado / limite;
  if (porcentaje >= 1) return 'excedido';
  if (porcentaje >= 0.8) return 'advertencia';
  return 'ok';
}