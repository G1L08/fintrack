import { cn } from '@/lib/utils';

type Variante = 'neutral' | 'positivo' | 'negativo' | 'advertencia';

interface KPICardProps {
  etiqueta: string;
  valor: string;
  detalle?: string;
  variante?: Variante;
  className?: string;
  onClick?: () => void;
}

const variantes: Record<Variante, { color: string; bg: string }> = {
  neutral: { color: 'text-[var(--foreground)]', bg: 'bg-[var(--muted)]/10' },
  positivo: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  negativo: { color: 'text-red-400', bg: 'bg-red-500/10' },
  advertencia: { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
};

export default function KPICard({
  etiqueta,
  valor,
  detalle,
  variante = 'neutral',
  className,
  onClick,
}: KPICardProps) {
  const v = variantes[variante];

  const base = cn(
    'rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors',
    onClick && 'cursor-pointer hover:border-emerald-500/40 text-left w-full',
    className
  );

  const contenido = (
    <>
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        {etiqueta}
      </p>
      <p className={cn('mt-2 text-2xl font-semibold tracking-tight', v.color)}>
        {valor}
      </p>
      {detalle && (
        <p className="mt-1.5 text-xs text-[var(--muted)]">{detalle}</p>
      )}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={base}>
        {contenido}
      </button>
    );
  }

  return <div className={base}>{contenido}</div>;
}