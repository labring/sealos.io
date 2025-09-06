import { languagesType } from '@/lib/i18n';
import { Package, Rocket, Code, ShieldCheck } from 'lucide-react';

const translations = {
  en: {
    chips: [
      { label: 'Image-based releases', Icon: Package },
      { label: 'One-click deploy', Icon: Rocket },
      { label: 'IDE-agnostic', Icon: Code },
      { label: '100% environment parity', Icon: ShieldCheck },
    ],
  },
  'zh-cn': {
    chips: [
      { label: '标准镜像发布', Icon: Package },
      { label: '一键部署', Icon: Rocket },
      { label: 'IDE 不限', Icon: Code },
      { label: '环境 100% 一致', Icon: ShieldCheck },
    ],
  },
};

export default function USPChips({
  lang = 'en',
}: {
  lang?: languagesType;
}) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <div className="mx-auto w-full max-w-4xl overflow-x-auto px-2 pb-1 sm:overflow-visible sm:px-0">
      <div className="mx-auto flex w-max items-center gap-2 sm:w-full sm:flex-wrap sm:justify-center sm:gap-2">
        {t.chips.map(({ label, Icon }, i) => (
          <span
            key={i}
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/60 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-800 shadow-sm backdrop-blur-[2px] transition-all hover:border-emerald-400/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          >
            <Icon aria-hidden className="h-4 w-4 text-emerald-600" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
