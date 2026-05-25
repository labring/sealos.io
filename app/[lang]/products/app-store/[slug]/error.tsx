'use client';

import Link from 'next/link';
import { ReloadIcon } from '@radix-ui/react-icons';
import AppStoreStatePanel from '../components/app-store-state-panel';

export default function AppStoreDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-background text-foreground min-h-screen px-6 pt-32 pb-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AppStoreStatePanel
          variant="error"
          title="Template detail could not load"
          description="We could not render this app detail page. Retry the page or return to the App Store."
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="focus-visible:ring-offset-background inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/[0.09] px-5 text-sm font-medium text-white transition duration-200 hover:bg-white/[0.16] focus-visible:ring-2 focus-visible:ring-[#6ea2ff] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
              >
                <ReloadIcon className="h-4 w-4" />
                Retry
              </button>
              <Link
                href="../"
                className="focus-visible:ring-offset-background inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-medium text-zinc-200 transition duration-200 hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#6ea2ff] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
              >
                Back to App Store
              </Link>
            </div>
          }
        />
      </div>
    </main>
  );
}
