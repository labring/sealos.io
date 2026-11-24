'use client';

import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGTM } from '@/hooks/use-gtm';
import { getRybbitCtaProps } from '@/lib/analytics/rybbit-cta';
import {
  CN_SITE_URL,
  consumeSiteLanguageChoice,
  dismissCnRecommendation,
  getBrowserLanguages,
  getChineseSiteHref,
  shouldRecommendChineseSite,
} from '@/lib/chinese-site-recommendation';
import { i18n } from '@/lib/i18n';

const CN_BANNER_HEIGHT_VAR = '--sealos-cn-banner-height';
const CN_BANNER_ACTIVE_ATTR = 'data-cn-banner-active';

function resetBannerCssState() {
  document.documentElement.style.setProperty(CN_BANNER_HEIGHT_VAR, '0px');
  document.documentElement.removeAttribute(CN_BANNER_ACTIVE_ATTR);
}

export function ChineseSiteBanner({ lang }: { lang: string }) {
  const pathname = usePathname();
  const { trackButton, trackCustom } = useGTM();
  const [visible, setVisible] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const [targetHref, setTargetHref] = useState(CN_SITE_URL);
  const bannerRef = useRef<HTMLElement>(null);
  const hasTrackedImpressionRef = useRef(false);
  const dismissedInMountRef = useRef(false);

  useEffect(() => {
    const currentHref = window.location.href;
    setTargetHref(getChineseSiteHref(currentHref));

    const consumedStayChoice = consumeSiteLanguageChoice(lang);
    const shouldShow =
      !dismissedInMountRef.current &&
      !consumedStayChoice &&
      shouldRecommendChineseSite({
        currentLocale: lang,
        defaultLocale: i18n.defaultLanguage,
        hostname: window.location.hostname,
        browserLanguages: getBrowserLanguages(),
      });

    setVisible(shouldShow);

    if (shouldShow && !hasTrackedImpressionRef.current) {
      hasTrackedImpressionRef.current = true;
      trackCustom('cn_site_banner_shown', {
        location: 'cn_site_banner',
        pathname,
      });
    }
  }, [lang, pathname, trackCustom]);

  useLayoutEffect(() => {
    const element = bannerRef.current;
    if (!visible || !element) {
      setBannerHeight(0);
      resetBannerCssState();
      return;
    }

    const measure = () => {
      const height = Math.ceil(element.getBoundingClientRect().height);
      setBannerHeight(height);
      document.documentElement.style.setProperty(
        CN_BANNER_HEIGHT_VAR,
        `${height}px`,
      );
      document.documentElement.setAttribute(CN_BANNER_ACTIVE_ATTR, 'true');
    };

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => {
        observer.disconnect();
        resetBannerCssState();
      };
    }

    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      resetBannerCssState();
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  const refreshHref = (anchor: HTMLAnchorElement) => {
    const nextHref = getChineseSiteHref(window.location.href);
    anchor.href = nextHref;
    return nextHref;
  };

  return (
    <>
      <aside
        ref={bannerRef}
        data-cn-site-banner
        aria-label="中国站访问提示"
        lang="zh-CN"
        className="cn-site-banner fixed inset-x-0 top-0 z-50 border-b"
      >
        <div className="mx-auto flex max-w-[1456px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:flex-nowrap sm:px-6 lg:px-8">
          <p className="min-w-0 flex-1 text-xs leading-relaxed sm:text-sm">
            {
              'Sealos 中国区与国际区账号独立。前往中国站（sealos.cn）后，请使用中国区账号登录。'
            }
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={targetHref}
              hrefLang="zh-CN"
              {...getRybbitCtaProps({
                id: 'cn_site_banner_go_cn',
                location: 'cn_site_banner',
                destination: 'sealos_cn',
              })}
              onClick={(event) => {
                const href = refreshHref(event.currentTarget);
                trackButton('前往中国站', 'cn_site_banner', 'url', href);
              }}
              onAuxClick={(event) => {
                refreshHref(event.currentTarget);
              }}
              onContextMenu={(event) => {
                refreshHref(event.currentTarget);
              }}
              className="cn-site-banner-cta inline-flex min-h-8 items-center justify-center rounded-full px-3.5 text-xs font-medium whitespace-nowrap transition-colors sm:min-h-9 sm:px-4 sm:text-sm"
            >
              前往中国站
            </a>
            <button
              type="button"
              aria-label="关闭中文站推荐"
              {...getRybbitCtaProps({
                id: 'cn_site_banner_dismiss',
                location: 'cn_site_banner',
                destination: 'dismiss',
              })}
              onClick={() => {
                dismissedInMountRef.current = true;
                dismissCnRecommendation();
                setVisible(false);
                trackCustom('cn_site_banner_dismiss', {
                  location: 'cn_site_banner',
                  pathname,
                });
              }}
              className="cn-site-banner-close inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors sm:size-9"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>
      <div
        aria-hidden="true"
        data-cn-site-banner-spacer
        className="shrink-0"
        style={{ height: bannerHeight }}
      />
    </>
  );
}
