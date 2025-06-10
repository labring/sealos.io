interface AppUseCasesProps {
  app: {
    useCases?: string[];
  };
  translations: {
    useCases: string;
  };
}

export default function AppUseCases({ app, translations }: AppUseCasesProps) {
  if (!app.useCases || app.useCases.length === 0) return null;

  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        {translations.useCases}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {app.useCases.map((useCase: string, index: number) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
              <svg
                className="h-4 w-4 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11"
                />
              </svg>
            </div>
            <span className="font-medium text-gray-700">
              {useCase}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
