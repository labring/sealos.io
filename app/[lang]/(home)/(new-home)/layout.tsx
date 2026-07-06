import { Header } from '@/new-components/Header';
import { FooterV2 } from '@/new-components/Footer';
import { siteConfig } from '@/config/site';
import type { languagesType } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function LayoutV2({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: languagesType };
}) {
  const hasBanner = Boolean(
    siteConfig.banner?.enabled && siteConfig.banner.text,
  );

  return (
    <>
      <div className="relative z-10 bg-[#03050b]">
        <div
          className={cn(
            'sticky z-50 w-full max-lg:-mb-8 max-lg:pt-8',
            hasBanner ? 'top-20 sm:top-14 lg:top-12' : 'top-0',
          )}
        >
          <Header />
        </div>

        {children}
      </div>

      <FooterV2 lang={params.lang} />
    </>
  );
}
