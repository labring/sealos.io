import { cn } from '@/lib/utils';
import {
  STATUS_LABELS,
  type TutorialInventoryStatus,
} from './tutorial-growth-data';

const statusClassNames: Record<TutorialInventoryStatus, string> = {
  available: 'border-blue-400/35 bg-blue-400/10 text-blue-100',
  coming_next: 'border-blue-300/25 bg-white/[0.06] text-zinc-200',
  planned: 'border-zinc-700 bg-white/[0.04] text-zinc-400',
};

export function TutorialStatusChip({
  status,
  className,
}: {
  status: TutorialInventoryStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-xs font-medium',
        statusClassNames[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
