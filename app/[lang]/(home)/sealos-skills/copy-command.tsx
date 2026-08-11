'use client';

import { useEffect, useState } from 'react';
import { Check, CircleAlert, Copy } from 'lucide-react';
import {
  getRybbitCtaProps,
  type RybbitCtaTracking,
} from '@/lib/analytics/rybbit-cta';
import { cn } from '@/lib/utils';

type CopyState = 'idle' | 'copied' | 'failed';
type CopyButtonTone = 'accent' | 'secondary' | 'quiet';

const COPY_RESET_DELAY = 1800;

async function writeClipboard(value: string) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-1000px';
  textarea.style.left = '-1000px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let copied = false;

  try {
    copied = document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }

  if (!copied) {
    throw new Error('Copy command failed');
  }
}

export function CopyCommandButton({
  className,
  iconClassName,
  label,
  copiedLabel = 'Copied',
  showStatus = false,
  tone = 'secondary',
  tracking,
  value,
}: {
  className?: string;
  iconClassName?: string;
  label: string;
  copiedLabel?: string;
  showStatus?: boolean;
  tone?: CopyButtonTone;
  tracking?: RybbitCtaTracking;
  value: string;
}) {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  useEffect(() => {
    if (copyState === 'idle') return;

    const resetTimer = window.setTimeout(
      () => setCopyState('idle'),
      COPY_RESET_DELAY,
    );

    return () => window.clearTimeout(resetTimer);
  }, [copyState]);

  const Icon =
    copyState === 'copied'
      ? Check
      : copyState === 'failed'
        ? CircleAlert
        : Copy;
  const visibleLabel =
    copyState === 'copied'
      ? copiedLabel
      : copyState === 'failed'
        ? 'Try again'
        : label;

  return (
    <button
      type="button"
      aria-label={label}
      aria-live="polite"
      title={label}
      onClick={async () => {
        try {
          await writeClipboard(value);
          setCopyState('copied');
        } catch {
          setCopyState('failed');
        }
      }}
      className={cn(
        'inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold whitespace-nowrap transition duration-200 focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13111C] focus-visible:outline-none active:translate-y-px motion-reduce:transition-none',
        tone === 'accent' &&
          'border-[#4CAFE1] bg-[#4CAFE1] text-[#0D1720] hover:border-[#77C4E9] hover:bg-[#77C4E9]',
        tone === 'secondary' &&
          'border-[#F5F2F8]/20 bg-[#F5F2F8]/[0.04] text-[#F5F2F8] hover:border-[#4CAFE1]/60 hover:bg-[#F5F2F8]/[0.08]',
        tone === 'quiet' &&
          'min-h-9 border-[#F5F2F8]/12 bg-transparent px-3 text-xs text-[#C6C0CF] hover:border-[#4CAFE1]/60 hover:text-[#F5F2F8]',
        className,
      )}
      {...(tracking ? getRybbitCtaProps(tracking) : {})}
    >
      <Icon
        className={cn('size-4', iconClassName)}
        strokeWidth={1.8}
        aria-hidden="true"
      />
      {(copyState === 'idle' || showStatus) && <span>{visibleLabel}</span>}
    </button>
  );
}
