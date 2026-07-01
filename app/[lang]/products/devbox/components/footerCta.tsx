import { AnimateElement } from '@/components/ui/animated-wrapper';
import { appDomain } from '@/config/site';
import { languagesType } from '@/lib/i18n';

export default function FooterCta({ lang = 'en' }: { lang?: languagesType }) {
  const buttonText =
    lang === 'zh-cn' ? '免费开始（无需信用卡）' : 'Start Free – No Credit Card';
  const buttonHref = `${appDomain}/?openapp=system-devbox`;
  return (
    <div className="pt-8 sm:pt-12">
      <AnimateElement type="slideUp">
        <section className="inset-shadow-bubble relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-12 text-center backdrop-blur sm:px-8 sm:py-16">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-400/60 to-transparent" />
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl leading-tight font-medium text-white sm:text-5xl">
              Develop faster and deploy smarter with DevBox
            </h2>
            <a
              href={buttonHref}
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full border border-white bg-white px-7 text-base font-medium text-zinc-950 transition-colors hover:bg-zinc-200 sm:w-auto"
            >
              {buttonText}
            </a>
          </div>
        </section>
      </AnimateElement>
    </div>
  );
}
