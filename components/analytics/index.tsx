'use client';

import Script from 'next/script';
import { analyticsConfig } from '@/config/analytics';
import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for delayed analytics loading
 * Implements user interaction-based and time-based loading strategies
 */
const useDelayedAnalytics = (delay: number = 3000) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  const enableAnalytics = useCallback(() => {
    setShouldLoad(true);
  }, []);

  useEffect(() => {
    // Set up delayed loading timer
    const timer = setTimeout(enableAnalytics, delay);

    // Set up interaction-based loading
    const interactionEvents = ['mousedown', 'touchstart', 'keydown', 'scroll'];

    const handleInteraction = () => {
      enableAnalytics();
      clearTimeout(timer);
      // Remove event listeners after first interaction
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };

    // Add event listeners for user interactions
    interactionEvents.forEach(event => {
      document.addEventListener(event, handleInteraction, {
        once: true,
        passive: true
      });
    });

    // Cleanup function
    return () => {
      clearTimeout(timer);
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [delay, enableAnalytics]);

  return shouldLoad;
};

// Optimized Clarity script loader with error handling
const loadClarity = (trackingId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available'));
      return;
    }

    const w = window as any;

    // Check if Clarity is already loaded
    if (w.clarity && typeof w.clarity === 'function') {
      resolve();
      return;
    }

    w.clarity =
      w.clarity ||
      function () {
        (w.clarity.q = w.clarity.q || []).push(arguments);
      };

    const d = document;
    const s = d.createElement('script');
    s.async = true;
    s.defer = true;
    s.src = `https://www.clarity.ms/tag/${trackingId}`;

    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load Clarity script for ${trackingId}`));

    const firstScript = d.getElementsByTagName('script')[0];
    firstScript?.parentNode?.insertBefore(s, firstScript);
  });
};

// Optimized Rybbit analytics script loader with error handling
const loadRybbitAnalytics = (siteId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available'));
      return;
    }

    const d = document;
    const s = d.createElement('script');
    s.async = true;
    s.defer = true;
    s.src = 'https://analytics.sealos.io/api/script.js';
    s.setAttribute('data-site-id', siteId);

    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load Rybbit analytics for site ${siteId}`));

    const firstScript = d.getElementsByTagName('script')[0];
    firstScript?.parentNode?.insertBefore(s, firstScript);
  });
};

/**
 * Analytics component with optimized loading strategies
 * Implements delayed loading to improve initial page performance
 */
export function Analytics() {
  const shouldLoadAnalytics = useDelayedAnalytics(3000);
  const [analyticsLoaded, setAnalyticsLoaded] = useState({
    gtm: false,
    clarity: false,
    rybbit: false,
  });

  // GTM Implementation with improved error handling and delayed loading
  useEffect(() => {
    if (!shouldLoadAnalytics || !analyticsConfig.gtm?.enabled || !analyticsConfig.gtm.containerId) {
      return;
    }

    // Avoid duplicate GTM initialization
    if (analyticsLoaded.gtm || (window.dataLayer && window.dataLayer.find((item) => item['gtm.start']))) {
      return;
    }

    const loadGTM = async () => {
      try {
        // Initialize dataLayer first
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js',
        });

        // Load GTM script with promise-based approach
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${analyticsConfig.gtm?.containerId}`;

        script.onload = () => {
          setAnalyticsLoaded(prev => ({ ...prev, gtm: true }));
          console.log('GTM loaded successfully');
        };

        script.onerror = () => {
          console.warn('Failed to load Google Tag Manager');
        };

        const firstScript = document.getElementsByTagName('script')[0];
        firstScript?.parentNode?.insertBefore(script, firstScript);
      } catch (error) {
        console.error('Error loading GTM:', error);
      }
    };

    loadGTM();
  }, [shouldLoadAnalytics, analyticsLoaded.gtm, analyticsConfig.gtm?.enabled, analyticsConfig.gtm?.containerId]);

  // Lazy load Clarity with delayed loading strategy
  useEffect(() => {
    if (!shouldLoadAnalytics || !analyticsConfig.clarity?.enabled || !analyticsConfig.clarity.trackingId || analyticsLoaded.clarity) {
      return;
    }

    const loadClarityScript = async () => {
      try {
        await loadClarity(analyticsConfig.clarity!.trackingId);
        setAnalyticsLoaded(prev => ({ ...prev, clarity: true }));
        console.log('Clarity loaded successfully');
      } catch (error) {
        console.warn('Failed to load Clarity:', error);
      }
    };

    // Additional delay for Clarity to avoid blocking main thread
    const timer = setTimeout(loadClarityScript, 1000);
    return () => clearTimeout(timer);
  }, [shouldLoadAnalytics, analyticsLoaded.clarity, analyticsConfig.clarity?.enabled, analyticsConfig.clarity?.trackingId]);

  // Lazy load Rybbit analytics with delayed loading strategy
  useEffect(() => {
    if (!shouldLoadAnalytics || !analyticsConfig.rybbit?.enabled || !analyticsConfig.rybbit.siteId || analyticsLoaded.rybbit) {
      return;
    }

    const loadRybbitScript = async () => {
      try {
        await loadRybbitAnalytics(analyticsConfig.rybbit!.siteId);
        setAnalyticsLoaded(prev => ({ ...prev, rybbit: true }));
        console.log('Rybbit analytics loaded successfully');
      } catch (error) {
        console.warn('Failed to load Rybbit analytics:', error);
      }
    };

    // Additional delay for Rybbit to spread the load
    const timer = setTimeout(loadRybbitScript, 2000);
    return () => clearTimeout(timer);
  }, [shouldLoadAnalytics, analyticsLoaded.rybbit, analyticsConfig.rybbit?.enabled, analyticsConfig.rybbit?.siteId]);

  return (
    <>
      {/* GTM NoScript fallback */}
      {analyticsConfig.gtm?.enabled && analyticsConfig.gtm.containerId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${analyticsConfig.gtm.containerId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}

      {/* Baidu Analytics - for zh-cn with delayed loading */}
      {shouldLoadAnalytics && analyticsConfig.baidu?.enabled && (
        <Script
          strategy="lazyOnload"
          id="baidu-analytics"
          onLoad={() => console.log('Baidu Analytics loaded')}
          onError={() => console.warn('Failed to load Baidu Analytics')}
        >
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

      {/* Google Analytics with delayed loading */}
      {shouldLoadAnalytics && analyticsConfig.google?.enabled && (
        <>
          <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.google.trackingId}`}
            id="google-analytics"
            onLoad={() => console.log('Google Analytics loaded')}
            onError={() => console.warn('Failed to load Google Analytics')}
          />
          <Script
            strategy="lazyOnload"
            id="google-analytics-config"
            onLoad={() => console.log('Google Analytics config loaded')}
          >
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

      {/* Email Analytics (Mautic) with delayed loading */}
      {shouldLoadAnalytics && analyticsConfig.email?.enabled && (
        <Script
          strategy="lazyOnload"
          id="email-analytics"
          onLoad={() => console.log('Email Analytics loaded')}
          onError={() => console.warn('Failed to load Email Analytics')}
        >
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
