interface EmptyStateProps {
  titulo: string;
  descripcion: string;
  accionTexto?: string;
  onAccion?: () => void;
}

export default function EmptyState({
  titulo,
  descripcion,
  accionTexto,
  onAccion,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]/50 p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--border)]/50 mx-auto mb-4 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-[var(--muted)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <p className="text-sm font-medium mb-1">{titulo}</p>
      <p className="text-xs text-[var(--muted)] mb-5 max-w-sm mx-auto">
        {descripcion}
      </p>
      {accionTexto && onAccion && (
        <button
          onClick={onAccion}
          className="text-xs px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-medium"
        >
          {accionTexto}
        </button>
      )}
    </div>
  );
}