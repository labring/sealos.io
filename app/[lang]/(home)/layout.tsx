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
    <>
      <ConditionalHomeHeader lang={params.lang}>
        <Header />
      </ConditionalHomeHeader>
      {children}
      <ConditionalHomeFooter lang={params.lang} />
    </>
  );
}
