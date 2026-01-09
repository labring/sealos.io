interface AppDescriptionProps {
  app: {
    name: string;
    longDescription?: string;
  };
}

export default function AppDescription({ app }: AppDescriptionProps) {
  if (!app.longDescription) return null;

  return (
    <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        About {app.name}
      </h2>
      <p className="leading-relaxed text-muted-foreground">
        {app.longDescription}
      </p>
    </div>
  );
}
