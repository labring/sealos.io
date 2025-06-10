interface AppFeaturesProps {
  app: {
    features: string[];
  };
  translations: {
    features: string;
  };
}

export default function AppFeatures({ app, translations }: AppFeaturesProps) {
  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        {translations.features}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {app.features.map((feature: string, index: number) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-4 w-4 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
