export interface AnalyticsConfig {
  baidu?: {
    trackingId: string;
    enabled: boolean;
  };
  google?: {
    trackingId: string;
    enabled: boolean;
  };
  clarity?: {
    trackingId: string;
    enabled: boolean;
  };
  email?: {
    enabled: boolean;
  };
  rybbit?: {
    siteId: string;
    enabled: boolean;
  };
  gtm?: {
    containerId: string;
    enabled: boolean;
  };
  // umami?: {
  //   websiteId: string;
  //   src: string;
  //   enabled: boolean;
  // }
}

import { i18n } from '@/lib/i18n';

// Define different analytics configurations for different languages
const analyticsConfigByLanguage: Record<string, AnalyticsConfig> = {
  en: {
    // Use GTM to manage all analytics
    gtm: {
      containerId: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-5DTRN2V3',
      enabled: true,
    },
    // Disable all services as they'll be managed by GTM
    baidu: {
      trackingId: '',
      enabled: false,
    },
    google: {
      trackingId: 'G-YF5VHZSTE0', // Google Analytics ID for English website
      enabled: false,
    },
    clarity: {
      trackingId: 'qf9f625a3h', // Clarity ID for English website
      enabled: false,
    },
    email: {
      enabled: false,
    },
    rybbit: {
      siteId: '1',
      enabled: false,
    },
  },
  'zh-cn': {
    baidu: {
      trackingId: 'd8e8ecf669c47dc2512d3f1417e761f9', // Baidu Analytics ID for Chinese website
      enabled: true,
    },
    google: {
      trackingId: '', // Google Analytics ID for Chinese website
      enabled: false,
    },
    clarity: {
      trackingId: 'ov517w4xcf', // Clarity ID for Chinese website
      enabled: true,
    },
    email: {
      enabled: true,
    },
    rybbit: {
      siteId: '',
      enabled: false,
    },
    gtm: {
      containerId: '',
      enabled: false,
    },
  },
};

// Get analytics configuration for the current default language
export const analyticsConfig: AnalyticsConfig = (() => {
  const currentLanguage = i18n.defaultLanguage;
  // Return configuration for the current language if available; otherwise return English configuration as default
  return (
    analyticsConfigByLanguage[currentLanguage] ||
    analyticsConfigByLanguage['en']
  );
})();
