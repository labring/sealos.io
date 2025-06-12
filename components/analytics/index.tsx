'use client';

import Script from 'next/script';
import { analyticsConfig } from '@/config/analytics';
import { useEffect } from 'react';

// Clarity script for lazy loading
const loadClarity = (trackingId: string) => {
  const w = window as any;
  w.clarity =
    w.clarity ||
    function () {
      (w.clarity.q = w.clarity.q || []).push(arguments);
    };
  const d = document;
  const s = d.createElement('script');
  s.async = true;
  s.src = 'https://www.clarity.ms/tag/' + trackingId;
  const firstScript = d.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(s, firstScript);
};

// Rybbit analytics script for lazy loading
const loadRybbitAnalytics = (siteId: string) => {
  const d = document;
  const s = d.createElement('script');
  s.async = true;
  s.defer = true;
  s.src = 'https://analytics.sealos.io/api/script.js';
  s.setAttribute('data-site-id', siteId);
  const firstScript = d.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(s, firstScript);
};

export function Analytics() {
  // GTM Implementation with improved error handling
  useEffect(() => {
    if (analyticsConfig.gtm?.enabled && analyticsConfig.gtm.containerId) {
      // Avoid duplicate GTM initialization
      if (
        window.dataLayer &&
        window.dataLayer.find((item) => item['gtm.start'])
      ) {
        return;
      }

      // Initialize dataLayer first
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });

      // Load GTM script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${analyticsConfig.gtm.containerId}`;
      script.onerror = () => {
        console.warn('Failed to load Google Tag Manager');
      };

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);
    }
  }, []);

  // Lazy load Clarity after page is fully loaded (only for zh-cn now)
  useEffect(() => {
    if (analyticsConfig.clarity?.enabled) {
      // Add a small delay to prioritize more important resources
      const timer = setTimeout(() => {
        loadClarity(analyticsConfig.clarity!.trackingId);
      }, 3000); // 3 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  // Lazy load Rybbit analytics after page is fully loaded
  useEffect(() => {
    if (analyticsConfig.rybbit?.enabled) {
      // Add a small delay to prioritize more important resources
      const timer = setTimeout(() => {
        loadRybbitAnalytics(analyticsConfig.rybbit!.siteId);
      }, 3500); // 3.5 seconds delay (slightly after Clarity)

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Google Tag Manager */}
      {analyticsConfig.gtm?.enabled && analyticsConfig.gtm.containerId && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${analyticsConfig.gtm.containerId}');
              `,
            }}
          />
        </>
      )}

      {/* Baidu Analytics - for zh-cn */}
      {analyticsConfig.baidu?.enabled && (
        <Script strategy="afterInteractive" id="baidu-analytics">
          {`
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?${analyticsConfig.baidu.trackingId}";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();
          `}
        </Script>
      )}

      {analyticsConfig.google?.enabled && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.google.trackingId}`}
            id="google-analytics"
          />
          <Script strategy="afterInteractive" id="google-analytics-config">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsConfig.google.trackingId}', {
                send_page_view: false  // Defer page view to improve FCP
              });
              // Send page view after the page is interactive
              if (document.readyState === 'complete') {
                gtag('event', 'page_view');
              } else {
                window.addEventListener('load', function() {
                  gtag('event', 'page_view');
                });
              }
            `}
          </Script>
        </>
      )}

      {analyticsConfig.email?.enabled && (
        <Script strategy="afterInteractive" id="email-analytics">
          {`
            (function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;
              w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
              m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://engage.sealos.io/mtc.js','mt');
            mt('send', 'pageview');
          `}
        </Script>
      )}
    </>
  );
}
