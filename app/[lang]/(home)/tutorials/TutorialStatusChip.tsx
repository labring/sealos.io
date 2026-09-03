import { cn } from '@/lib/utils';
import {
  STATUS_LABELS,
  type TutorialInventoryStatus,
} from './tutorial-growth-data';

const statusClassNames: Record<TutorialInventoryStatus, string> = {
  available: 'border-blue-400/35 bg-blue-400/10 text-blue-200',
  coming_next: 'border-border bg-muted text-foreground',
  planned: 'border-border bg-muted text-muted-foreground',
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
