// Abuse report page entry, assembling layout and form components.

import { languagesType } from '@/lib/i18n';
import Footer from '@/components/footer';
import { Header } from '@/new-components/Header';
import Hero from '@/components/header/hero';
import { getAbuseTranslations } from './content';
import AbuseIntro from './components/abuse-intro';
import AbuseForm from './components/abuse-form';
import AbuseContact from './components/abuse-contact';

export default function AbusePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = getAbuseTranslations(params.lang);

  return (
    <div
      data-theme="app-store"
      className="bg-background text-foreground min-h-screen"
    >
      <div className="sticky top-0 z-50 w-full">
        <Header lang={params.lang} />
      </div>

      <main className="custom-container px-4 pt-14 pb-20 sm:px-6 lg:px-8">
        <Hero
          title={t.title}
          mainTitleEmphasis={1}
          variant="app-store"
          lang={params.lang}
          testimonial={false}
          videoCta={false}
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
              <AbuseIntro content={t} />
              <AbuseForm content={t} />
            </div>

            <AbuseContact content={t} />
          </div>
        </Hero>
      </main>
      <div className="bg-border h-[1px]"></div>
      <Footer lang={params.lang} />
    </div>
  );
}
