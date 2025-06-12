'use client';

import { analyticsConfig } from '@/config/analytics';

/**
 * GTM Body component for noscript fallback
 * placed right after the opening <body> tag
 */
export function GTMBody() {
  if (!analyticsConfig.gtm?.enabled || !analyticsConfig.gtm.containerId) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${analyticsConfig.gtm.containerId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
