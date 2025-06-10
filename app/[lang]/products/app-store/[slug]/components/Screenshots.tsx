interface AppScreenshotsProps {
  app: {
    name: string;
    screenshots?: string[];
  };
}

export default function AppScreenshots({ app }: AppScreenshotsProps) {
  if (!app.screenshots || app.screenshots.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Screenshots
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {app.screenshots.map((screenshot: string, index: number) => (
          <img
            key={index}
            src={screenshot}
            alt={`${app.name} screenshot ${index + 1}`}
            className="rounded-lg border border-gray-200"
          />
        ))}
      </div>
    </div>
  );
}
