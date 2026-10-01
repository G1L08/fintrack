import { categoriaConfig } from '@/lib/utils';
import type { Categoria } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  categoria: Categoria;
  className?: string;
}

export default function CategoryBadge({ categoria, className }: CategoryBadgeProps) {
  const config = categoriaConfig[categoria];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
        config.bg,
        config.color,
        config.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.color.replace('text-', 'bg-'))} />
      {config.etiqueta}
    </span>
  );
}