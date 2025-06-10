interface AppDescriptionProps {
  app: {
    name: string;
    longDescription?: string;
  };
}

export default function AppDescription({ app }: AppDescriptionProps) {
  if (!app.longDescription) return null;

  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        About {app.name}
      </h2>
      <p className="leading-relaxed text-gray-700">
        {app.longDescription}
      </p>
    </div>
  );
}
