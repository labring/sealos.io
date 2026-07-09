import { languagesType } from '@/lib/i18n';

const translations = {
  en: {
    title: 'Integrated: code → release → deploy',
    points: ['Standard image-based', 'Team-standardized', 'Governed & secure'],
  },
  'zh-cn': {
    title: '一体化：编码 → 发布 → 部署',
    points: ['标准镜像', '团队标准化', '治理与安全'],
  },
};

export default function PositioningStrip({
  lang = 'en',
}: {
  lang?: languagesType;
}) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <section className="mt-10 w-full">
      <div className="inset-shadow-bubble relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-1.5 rounded-full bg-gradient-to-b from-blue-300 to-blue-600" />
            <p className="text-sm font-medium text-white sm:text-base">
              {t.title}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {t.points.map((p, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-blue-400/60"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
