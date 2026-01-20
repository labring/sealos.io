// Left-side info section for the abuse report page.

import { AbuseTranslations } from '../content';
import { ShieldIcon, ClockIcon, CheckIcon } from './icons';

type AbuseIntroProps = {
  content: AbuseTranslations;
};

export default function AbuseIntro({ content }: AbuseIntroProps) {
  return (
    <div className="space-y-8 text-left">
      <div className="inline-flex items-center rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10">
        <ShieldIcon className="mr-2 h-5 w-5 text-custom-primary-text" aria-hidden="true" />
        <span className="text-sm font-semibold text-custom-primary-text">
          {content.badgeText}
        </span>
      </div>

      <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
        {content.introText}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
              <ClockIcon className="h-5 w-5 text-emerald-200" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {content.trustCards.responseTitle}
              </p>
              <p className="text-xs text-muted-foreground">{content.slaText}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
              <ShieldIcon className="h-5 w-5 text-blue-200" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {content.trustCards.reviewTitle}
              </p>
              <p className="text-xs text-muted-foreground">{content.trustCards.reviewDesc}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent p-6">
        <h3 className="text-base font-semibold text-foreground">{content.guideTitle}</h3>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          {content.guideItems.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckIcon className="h-4 w-4 text-emerald-200" aria-hidden="true" />
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
