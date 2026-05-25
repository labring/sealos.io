import Link from 'next/link';
import AppStoreStatePanel from '../components/app-store-state-panel';

export default function AppStoreDetailNotFound() {
  return (
    <main className="bg-background text-foreground min-h-screen px-6 pt-32 pb-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AppStoreStatePanel
          variant="not-found"
          action={
            <Link
              href="../"
              className="focus-visible:ring-offset-background inline-flex h-11 items-center justify-center rounded-full bg-white/[0.09] px-5 text-sm font-medium text-white transition duration-200 hover:bg-white/[0.16] focus-visible:ring-2 focus-visible:ring-[#6ea2ff] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
            >
              Back to App Store
            </Link>
          }
        />
      </div>
    </main>
  );
}
