import AppStoreStatePanel from '../components/app-store-state-panel';

export default function AppStoreDetailLoading() {
  return (
    <main className="bg-background text-foreground min-h-screen px-6 pt-32 pb-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AppStoreStatePanel
          variant="loading"
          title="Loading template details"
          description="Preparing the app preview, README, and related templates."
        />
      </div>
    </main>
  );
}
