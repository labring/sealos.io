'use client';

import { type ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import {
  CheckCircle2,
  ChevronDown,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

import { screenTransition } from './deploy-demo-common';

export type SelectOption = {
  icon?: StaticImageData | string;
  label: string;
};

export function getFieldText<TField extends string>(
  field: TField,
  index: number,
  progress: number,
  steps: Array<{
    activeField?: TField;
    typed?: Partial<Record<TField, string>>;
  }>,
  finalValues: Record<TField, string>,
) {
  const step = steps[index];
  const target = getLatestFieldValue(field, index, steps);

  if (step.activeField !== field || step.typed?.[field] === undefined) {
    return target;
  }

  const previous = getLatestFieldValue(field, index - 1, steps);
  const next = step.typed[field] ?? finalValues[field];
  const localProgress = Math.min(1, Math.max(0, progress));

  if (next.startsWith(previous)) {
    const added = next.slice(previous.length);
    return previous + added.slice(0, Math.round(added.length * localProgress));
  }

  return next.slice(0, Math.round(next.length * localProgress));
}

export function getPreviousField<TField extends string>(
  index: number,
  steps: Array<{ activeField?: TField }>,
) {
  for (let i = index - 1; i >= 0; i -= 1) {
    const field = steps[i]?.activeField;
    if (field) return field;
  }
}

function getLatestFieldValue<TField extends string>(
  field: TField,
  index: number,
  steps: Array<{ typed?: Partial<Record<TField, string>> }>,
) {
  for (let i = index; i >= 0; i -= 1) {
    const value = steps[i]?.typed?.[field];
    if (value !== undefined) return value;
  }

  return '';
}

export function DemoMotion({
  children,
  direction,
}: {
  children: ReactNode;
  direction: 'left' | 'right';
}) {
  const x = direction === 'left' ? -16 : 24;

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, x, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x, filter: 'blur(8px)' }}
      transition={screenTransition}
    >
      {children}
    </motion.div>
  );
}

export function DemoPanel({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/[0.07] bg-[#1E2026] p-3">
      {children}
    </section>
  );
}

export function SelectDisplay({
  className,
  fieldLabel,
  label,
  muted = false,
  options,
  pressed = false,
  ready = false,
  target,
}: {
  className?: string;
  fieldLabel?: string;
  label: string;
  muted?: boolean;
  options: SelectOption[];
  pressed?: boolean;
  ready?: boolean;
  target: string;
}) {
  const selectedOption = options.find((option) => option.label === label);

  return (
    <div className={cn('relative', className)}>
      {fieldLabel && (
        <span className="mb-1 block text-[10px] text-zinc-400">
          {fieldLabel}
        </span>
      )}
      <button
        data-demo-target={target}
        className={cn(
          'flex h-8 w-full items-center justify-between gap-2 rounded-md border border-white/[0.08] bg-black/20 px-3 text-left text-[11px] text-zinc-100 transition-colors',
          (pressed || ready) &&
            'border-blue-400/60 shadow-[0_0_0_3px_rgba(59,130,246,0.14)]',
          muted && 'text-zinc-600',
        )}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedOption?.icon && (
            <Image
              alt=""
              className="size-4 shrink-0 rounded-sm"
              src={selectedOption.icon}
            />
          )}
          <span className="truncate">{label}</span>
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-zinc-500" aria-hidden />
      </button>
      <AnimatePresence>
        {pressed && (
          <motion.div
            className="absolute right-0 left-0 z-20 mt-1 overflow-hidden rounded-md border border-white/[0.08] bg-[#11131A] p-1 shadow-[0_14px_40px_rgba(0,0,0,0.32)]"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={screenTransition}
          >
            {options.map((option, index) => (
              <div
                key={option.label}
                className={cn(
                  'flex h-7 items-center gap-2 rounded-sm px-2 text-[11px]',
                  ready && index === 0
                    ? 'bg-blue-500/15 text-blue-200'
                    : 'text-zinc-400',
                )}
              >
                {option.icon && (
                  <Image
                    alt=""
                    className="size-4 shrink-0 rounded-sm"
                    src={option.icon}
                  />
                )}
                <span className="truncate">{option.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DeployAction({
  deploying,
  pressed,
  success,
}: {
  deploying?: boolean;
  pressed: boolean;
  success?: boolean;
}) {
  return (
    <button
      data-demo-target="deploy"
      className={cn(
        'flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 text-[12px] font-medium text-white shadow-lg shadow-blue-500/20',
        pressed && 'bg-blue-400',
        success && 'bg-emerald-500 shadow-emerald-500/20',
      )}
      type="button"
    >
      {success ? (
        <CheckCircle2 className="size-3.5" aria-hidden />
      ) : (
        <Rocket className="size-3.5" aria-hidden />
      )}
      {deploying ? 'Deploying...' : success ? 'Deployed' : 'Deploy'}
    </button>
  );
}
