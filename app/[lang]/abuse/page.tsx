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
    <div data-theme="app-store" className="min-h-screen bg-background text-foreground">
      <div className="sticky top-21 z-50 container pt-8 sm:top-14 lg:top-12">
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
      <div className="h-[1px] bg-border"></div>
      <Footer lang={params.lang} />
    </div>
  );
}
