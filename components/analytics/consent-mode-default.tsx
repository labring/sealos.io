import { analyticsConfig } from '@/config/analytics';

const consentModeDefaults = `
window.dataLayer = window.dataLayer || [];
window.__sealosConsent = window.__sealosConsent || {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
};
function gtag(){window.dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
window.__sealosUpdateConsent = window.__sealosUpdateConsent || function(update) {
  update = update || {};
  var next = {
    ad_storage: update.ad_storage === 'granted' ? 'granted' : 'denied',
    analytics_storage: update.analytics_storage === 'granted' ? 'granted' : 'denied',
    ad_user_data: update.ad_user_data === 'granted' ? 'granted' : 'denied',
    ad_personalization: update.ad_personalization === 'granted' ? 'granted' : 'denied'
  };
  window.__sealosConsent = next;
  gtag('consent', 'update', next);
  window.dataLayer.push({ event: 'consent_update', ...next });
};
`;

export function ConsentModeDefault() {
  if (!analyticsConfig.gtm?.enabled || !analyticsConfig.gtm.containerId) {
    return null;
  }

  return (
    <script
      id="consent-mode-default"
      dangerouslySetInnerHTML={{ __html: consentModeDefaults }}
    />
  );
}
