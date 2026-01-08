interface WhyThisSoftwareProps {
  app: {
    benefits: string[];
  };
  translations: {
    whyThisSoftware: string;
  };
}

export default function WhyThisSoftware({
  app,
  translations,
}: WhyThisSoftwareProps) {
  return (
    <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        {translations.whyThisSoftware}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {app.benefits.map((benefit: string, index: number) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <svg
                className="h-4 w-4 text-zinc-200"
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
            <span className="leading-relaxed text-muted-foreground">
              {benefit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
