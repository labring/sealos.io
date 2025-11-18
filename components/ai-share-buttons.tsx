'use client';

import { languagesType } from '@/lib/i18n';
import { Sparkles } from 'lucide-react';
import {
  AIShareButton,
  SocialShareButton,
} from '@/components/ui/share-buttons';
import { GradientText } from '@/new-components/GradientText';
import { AiAgentStar } from '@/app/[lang]/(home)/blog/components/AiAgentStar';

interface AIShareButtonsProps {
  lang: languagesType;
  className?: string;
}

export default function AIShareButtons({
  lang,
  className = '',
}: AIShareButtonsProps) {
  // Translations with descriptions
  const translations = {
    en: {
      title: 'Explore with AI',
      subtitle: 'Get AI insights on this article',
      chatgpt: 'ChatGPT Summary',
      perplexity: 'Perplexity Analysis',
      claude: 'Claude Insights',
      gemini: 'Google AI',
      grok: 'Grok',
      shareTitle: 'Share this article',
      tip: 'AI will help you summarize key points and analyze technical details.',
      descriptions: {
        chatgpt: 'Smart Summary',
        perplexity: 'Deep Analysis',
        claude: 'Professional Insights',
        gemini: 'Quick Insights',
        grok: 'X AI Analysis',
      },
    },
    'zh-cn': {
      title: '用AI探索',
      subtitle: '获取这篇文章的AI见解',
      chatgpt: 'ChatGPT 总结',
      perplexity: 'Perplexity 分析',
      claude: 'Claude 洞察',
      gemini: 'Google AI',
      grok: 'Grok',
      shareTitle: '分享这篇文章',
      tip: 'AI将帮助您总结要点并分析技术细节。',
      descriptions: {
        chatgpt: '智能总结',
        perplexity: '深度分析',
        claude: '专业洞察',
        gemini: '快速见解',
        grok: 'X AI 分析',
      },
    },
  };

  const t = translations[lang];

  return (
    <div className={`inset-shadow-bubble rounded-xl p-9 ${className}`}>
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="text-blue-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-primary text-xl font-semibold">{t.title}</h3>
        </div>
        <p className="text-muted-foreground text-sm">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-x-2.5 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
        <AIShareButton
          platform="chatgpt"
          label={t.chatgpt}
          description={t.descriptions.chatgpt}
          variant="full"
          lang={lang}
        />
        <AIShareButton
          platform="perplexity"
          label={t.perplexity}
          description={t.descriptions.perplexity}
          variant="full"
          lang={lang}
        />
        <AIShareButton
          platform="claude"
          label={t.claude}
          description={t.descriptions.claude}
          variant="full"
          lang={lang}
        />
        <AIShareButton
          platform="gemini"
          label={t.gemini}
          description={t.descriptions.gemini}
          variant="full"
          lang={lang}
        />
        <AIShareButton
          platform="grok"
          label={t.grok}
          description={t.descriptions.grok}
          variant="full"
          lang={lang}
        />
      </div>

      <div className="mt-6 flex items-center gap-4 border-t pt-4">
        <h4 className="text-muted-foreground text-sm">{t.shareTitle}</h4>
        <div className="flex flex-wrap gap-2">
          <SocialShareButton platform="linkedin" variant="full" />
          <SocialShareButton platform="x" variant="full" />
          <SocialShareButton platform="whatsapp" variant="full" />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border p-3">
        <div className="flex text-sm">
          <GradientText>Tip:</GradientText>
          <AiAgentStar className="mr-1" />
          <span className="text-muted-foreground">{t.tip}</span>
        </div>
      </div>
    </div>
  );
}
