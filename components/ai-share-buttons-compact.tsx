'use client';

import { languagesType } from '@/lib/i18n';
import {
  AIShareButton,
  SocialShareButton,
} from '@/components/ui/share-buttons';

interface AIShareButtonsCompactProps {
  lang: languagesType;
  className?: string;
}

export default function AIShareButtonsCompact({
  lang,
  className = '',
}: AIShareButtonsCompactProps) {
  // Translations
  const translations = {
    en: {
      title: 'Share at:',
      scira: 'Scira AI',
      chatgpt: 'ChatGPT',
      perplexity: 'Perplexity',
      claude: 'Claude',
      gemini: 'Google AI',
      grok: 'Grok',
      t3chat: 'T3 Chat',
    },
    'zh-cn': {
      title: '分享到：',
      scira: 'Scira AI',
      chatgpt: 'ChatGPT',
      perplexity: 'Perplexity',
      claude: 'Claude',
      gemini: 'Google AI',
      grok: 'Grok',
      t3chat: 'T3 Chat',
    },
  };

  const t = translations[lang];

  return (
    <div
      className={`flex flex-col gap-4 text-sm xl:flex-row xl:items-center ${className}`}
    >
      <span className="text-muted-foreground shrink-0 text-sm">{t.title}</span>

      {/* AI share button group */}
      <div className="flex flex-wrap gap-2">
        <AIShareButton
          platform="scira"
          label={t.scira}
          variant="compact"
          lang={lang}
        />
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
        <AIShareButton
          platform="t3chat"
          label={t.t3chat}
          variant="compact"
          lang={lang}
        />

        <SocialShareButton platform="linkedin" variant="compact" />
        <SocialShareButton platform="x" variant="compact" />
        <SocialShareButton platform="whatsapp" variant="compact" />
      </div>
    </div>
  );
}
