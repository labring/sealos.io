import Link from 'fumadocs-core/link';
import { RSSIcon } from './icons';
import { languagesType } from '@/lib/i18n';

interface RSSButtonProps {
  lang: languagesType;
  className?: string;
}

const translations: Record<languagesType, string> = {
  en: 'Subscribe',
  'zh-cn': '订阅 RSS',
};

export function RSSButton({ lang, className = '' }: RSSButtonProps) {
  return (
    <Link
      href="/rss.xml"
      className={`group inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/10 hover:border-primary/30 hover:shadow-sm hover:scale-105 ${className}`}
      aria-label={translations[lang]}
      title={translations[lang]}
    >
      <RSSIcon className="transition-transform duration-200 group-hover:rotate-12" />
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
        {translations[lang]}
      </span>
    </Link>
  );
}
