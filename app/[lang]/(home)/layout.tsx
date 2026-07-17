import { Header } from '@/new-components/Header';
import { FooterV2 } from '@/new-components/Footer';
import type { languagesType } from '@/lib/i18n';

export default function HomeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: languagesType };
}) {
  return (
    <>
      <div className="bg-background relative z-10">
        <div className="sticky top-0 z-50 w-full max-lg:-mb-8">
          <Header />
        </div>
        {children}
      </div>
      <FooterV2 lang={params.lang} />
    </>
  );
}
