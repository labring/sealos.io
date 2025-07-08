'use client';

import { languagesType } from '@/lib/i18n';
import { AIShareButton, SocialShareButton } from '@/components/ui/share-buttons';

interface AIShareButtonsCompactProps {
  lang: languagesType;
  className?: string;
}

export default function AIShareButtonsCompact({ lang, className = '' }: AIShareButtonsCompactProps) {
  // Translations
  const translations = {
    en: {
      title: 'Share at:',
      chatgpt: 'ChatGPT',
      perplexity: 'Perplexity',
      claude: 'Claude',
      gemini: 'Google AI',
      grok: 'Grok'
    },
    'zh-cn': {
      title: '分享到：',
      chatgpt: 'ChatGPT',
      perplexity: 'Perplexity',
      claude: 'Claude',
      gemini: 'Google AI',
      grok: 'Grok'
    }
  };

  const t = translations[lang];

  return (
    <div className={`flex flex-col xl:flex-row xl:items-center gap-1.5 text-sm ${className}`}>
      <span className="font-medium text-gray-700 shrink-0 text-xs">{t.title}</span>

      {/* AI share button group */}
      <div className="flex flex-wrap gap-1">
        <AIShareButton
          platform="chatgpt"
          label={t.chatgpt}
          variant="compact"
          lang={lang}
        />
        <AIShareButton
          platform="perplexity"
          label={t.perplexity}
          variant="compact"
          lang={lang}
        />
        <AIShareButton
          platform="claude"
          label={t.claude}
          variant="compact"
          lang={lang}
        />
        <AIShareButton
          platform="gemini"
          label={t.gemini}
          variant="compact"
          lang={lang}
        />
        <AIShareButton
          platform="grok"
          label={t.grok}
          variant="compact"
          lang={lang}
        />
      </div>

      {/* Separator */}
      <span className="text-gray-400 mx-0.5 hidden xl:inline shrink-0 text-xs">|</span>

      {/* Social share button group */}
      <div className="flex flex-wrap gap-1">
        <SocialShareButton
          platform="linkedin"
          variant="compact"
        />
        <SocialShareButton
          platform="x"
          variant="compact"
        />
        <SocialShareButton
          platform="whatsapp"
          variant="compact"
        />
      </div>
    </div>
  );
}
