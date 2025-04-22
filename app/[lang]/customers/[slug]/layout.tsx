import Header from '@/components/header';
import { ReactNode } from 'react';
import { languagesType } from '@/lib/i18n';

export default function CaseStudyLayout({
  params,
  children,
}: {
  params: { lang: languagesType };
  children: ReactNode;
}) {
  return (
    <div className="h-full">
      <Header lang={params.lang} />
      <div className="custom-container min-h-screen">{children}</div>
    </div>
  );
}
