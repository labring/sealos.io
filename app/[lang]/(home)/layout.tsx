import { Header } from '@/new-components/Header';
import type { languagesType } from '@/lib/i18n';
import { ConditionalHomeHeader } from './conditional-home-header';
import { ConditionalHomeFooter } from './conditional-home-footer';

export default function HomeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: languagesType };
}) {
  return (
    <div className="bg-background relative z-10">
      <div className="relative z-50">
        <ConditionalHomeHeader lang={params.lang}>
          <Header />
        </ConditionalHomeHeader>
      </div>
      {children}
      <ConditionalHomeFooter lang={params.lang} />
    </div>
  );
}
