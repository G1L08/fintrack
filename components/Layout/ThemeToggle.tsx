'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [oscuro, setOscuro] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    const guardado = localStorage.getItem('fintrack-tema');
    const prefiereOscuro = guardado
      ? guardado === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setOscuro(prefiereOscuro);
    document.documentElement.classList.toggle('dark', prefiereOscuro);
  }, []);

  function alternar() {
    const nuevo = !oscuro;
    setOscuro(nuevo);
    document.documentElement.classList.toggle('dark', nuevo);
    localStorage.setItem('fintrack-tema', nuevo ? 'dark' : 'light');
  }

  if (!montado) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={alternar}
      aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--border)]/50 transition-colors flex items-center justify-center"
    >
      {oscuro ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}