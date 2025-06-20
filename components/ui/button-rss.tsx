'use client';

import { useButtonHandler } from '@/hooks/use-button-handler';
import { ButtonLink } from './button-link';
import { RSSIcon } from './icons';
import { languagesType } from '@/lib/i18n';

interface RSSButtonProps {
  lang: languagesType;
  className?: string;
  location?: string;
}

const translations: Record<languagesType, string> = {
  en: 'Subscribe',
  'zh-cn': '订阅 RSS',
};

export function RSSButton({
  lang,
  className = '',
  location = 'rss-button',
}: RSSButtonProps) {
  const { handleClick } = useButtonHandler({
    title: translations[lang],
    location,
    href: '/rss.xml',
    actionType: 'url',
  });

  return (
    <ButtonLink
      href="/rss.xml"
      title={translations[lang]}
      className={`group border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/30 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-sm ${className}`}
      onClick={handleClick}
    >
      <RSSIcon className="transition-transform duration-200 group-hover:rotate-12" />
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
        {translations[lang]}
      </span>
    </ButtonLink>
  );
}
