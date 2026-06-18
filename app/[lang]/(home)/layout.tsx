import { Header } from '@/new-components/Header';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { ConditionalHomeFooter } from './conditional-home-footer';

export default function NewLandingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const hasBanner = Boolean(
    siteConfig.banner?.enabled && siteConfig.banner.text,
  );
  return (
    <>
      <div
        className={cn(
          'sticky z-50 container max-lg:pt-8',
          hasBanner ? 'top-20 sm:top-14 lg:top-12' : 'top-0',
        )}
      >
        <Header />
      </div>

      {children}

      <ConditionalHomeFooter lang={params.lang} />
    </>
  );
}
