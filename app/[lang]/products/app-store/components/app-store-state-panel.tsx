import type { ReactNode } from 'react';
import {
  BoxIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

export type AppStoreStateVariant =
  | 'loading'
  | 'empty'
  | 'no-results'
  | 'error'
  | 'not-found';

interface AppStoreStatePanelProps {
  variant: AppStoreStateVariant;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const stateDefaults: Record<
  AppStoreStateVariant,
  {
    title: string;
    description: string;
    icon: typeof BoxIcon;
  }
> = {
  loading: {
    title: 'Loading app templates',
    description: 'Building the marketplace view with current template data.',
    icon: ReloadIcon,
  },
  empty: {
    title: 'No app templates are available',
    description:
      'Template data is currently unavailable. Please refresh the page or try again later.',
    icon: BoxIcon,
  },
  'no-results': {
    title: 'No apps match these filters',
    description: 'Adjust your search or clear filters to browse all templates.',
    icon: MagnifyingGlassIcon,
  },
  error: {
    title: 'App Store could not load',
    description:
      'The page hit a rendering problem. Retry the page or return to the marketplace.',
    icon: ExclamationTriangleIcon,
  },
  'not-found': {
    title: 'Template not found',
    description:
      'This app template is unavailable or its link has changed. Return to the marketplace to continue browsing.',
    icon: BoxIcon,
  },
};

function LoadingSkeleton() {
  return (
    <div aria-hidden="true" className="mt-9 grid w-full gap-3 sm:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="h-20 rounded-xl border border-white/10 bg-white/[0.035] p-3"
        >
          <div className="h-3 w-2/3 rounded-full bg-white/[0.12]" />
          <div className="mt-3 h-2 w-full rounded-full bg-white/[0.08]" />
          <div className="mt-2 h-2 w-4/5 rounded-full bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

export default function AppStoreStatePanel({
  variant,
  title,
  description,
  action,
  className,
}: AppStoreStatePanelProps) {
  const defaults = stateDefaults[variant];
  const Icon = defaults.icon;
  const isLoading = variant === 'loading';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] px-6 py-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:px-10',
        className,
      )}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={isLoading ? 'polite' : undefined}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(20,109,255,0.16),transparent_42%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-xl flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-[#6ea2ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Icon className={cn('h-6 w-6', isLoading && 'animate-spin')} />
        </div>
        <h3 className="mt-5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title || defaults.title}
        </h3>
        <p className="mt-3 max-w-[58ch] text-sm leading-6 text-zinc-400">
          {description || defaults.description}
        </p>
        {isLoading && <LoadingSkeleton />}
        {action && <div className="mt-7 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
