'use client';

import { useEffect, useState } from 'react';
import {
  CheckIcon,
  ClipboardCopyIcon,
  CrossCircledIcon,
} from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

type CopyState = 'idle' | 'copied' | 'failed';

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
  showStatus = false,
  value,
}: {
  className?: string;
  iconClassName?: string;
  label: string;
  showStatus?: boolean;
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
      ? CheckIcon
      : copyState === 'failed'
        ? CrossCircledIcon
        : ClipboardCopyIcon;
  const statusText = copyState === 'failed' ? 'Copy failed' : 'Copied';

  return (
    <button
      type="button"
      aria-label={label}
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
        'inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-3 font-medium transition duration-200 hover:border-[#4CAFE1]/45 hover:bg-white/[0.075] hover:text-white focus-visible:ring-2 focus-visible:ring-[#4CAFE1]/70 focus-visible:outline-none active:translate-y-px',
        copyState === 'copied' && 'border-[#81C784]/45 text-[#81C784]',
        copyState === 'failed' && 'border-[#D8B25D]/45 text-[#D8B25D]',
        className,
      )}
    >
      <Icon className={cn('size-4', iconClassName)} />
      {showStatus && copyState !== 'idle' && (
        <span className="font-mono text-xs">{statusText}</span>
      )}
    </button>
  );
}
