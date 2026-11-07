'use client';

import { useEffect, useRef } from 'react';
import {
  createBrowserAcquisitionRuntime,
  readAcquisitionContext,
  subscribeAcquisitionConsent,
} from '@/lib/acquisition-handoff';

export function AcquisitionObserver() {
  const observations = useRef<{
    observedVisitor?: string;
    consentSnapshot?: string;
  }>({});
  useEffect(() => {
    const state = observations.current;
    const runtimeWindow = window as Window & {
      dataLayer?: unknown[];
    };
    const emit = (name: string) => {
      const context = readAcquisitionContext(createBrowserAcquisitionRuntime());
      if (!context.visitor_id) return;
      const properties = {
        visitor_id: context.visitor_id,
        surface: 'website',
        product_edition: 'global',
        analytics_consent: 'granted',
        acquisition_source: context.source?.source ?? null,
        acquisition_medium: context.source?.medium ?? null,
        acquisition_campaign: context.source?.campaign ?? null,
      };
      runtimeWindow.dataLayer = runtimeWindow.dataLayer || [];
      runtimeWindow.dataLayer.push({ event: name, ...properties });
    };
    const visit = () => {
      const context = readAcquisitionContext(createBrowserAcquisitionRuntime());
      if (context.consent.analytics_storage !== 'unspecified') {
        // Restore a real saved choice before GTM handles this page's first visit.
        // Unspecified ads stay denied; only newly observed CMP grants can enable them.
        const permissions = {
          analytics_storage: context.consent.analytics_storage,
          ad_storage:
            context.consent.ad_storage === 'granted' ? 'granted' : 'denied',
          ad_user_data:
            context.consent.ad_user_data === 'granted' ? 'granted' : 'denied',
          ad_personalization:
            context.consent.ad_personalization === 'granted'
              ? 'granted'
              : 'denied',
        };
        const snapshot = JSON.stringify(permissions);
        if (state.consentSnapshot !== snapshot) {
          // Set before push: existing GTM refresh callbacks may re-enter this observer.
          state.consentSnapshot = snapshot;
          runtimeWindow.dataLayer = runtimeWindow.dataLayer || [];
          runtimeWindow.dataLayer.push({
            event: 'sealos_consent_update',
            ...permissions,
          });
        }
      }
      if (!context.visitor_id) {
        state.observedVisitor = undefined;
        return;
      }
      if (state.observedVisitor !== context.visitor_id) {
        state.observedVisitor = context.visitor_id;
        emit('acquisition_visit');
      }
    };
    const click = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest('a[download], a[data-desktop-download]')
          : null;
      if (target) emit('download_click');
    };
    visit();
    const unsubscribeConsent = subscribeAcquisitionConsent(visit);
    document.addEventListener('click', click, true);
    return () => {
      unsubscribeConsent();
      document.removeEventListener('click', click, true);
    };
  }, []);
  return null;
}
