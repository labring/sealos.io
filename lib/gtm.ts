export interface GTMEvent {
  event: string;
  [key: string]: unknown;
}

export type MarketingEventName =
  | 'build_started'
  | 'deploy_success'
  | 'running_24h'
  | 'new_subscription'
  | 'topup_success';

export interface MarketingTouchpoint {
  campaign?: string;
  channel?: string;
  click_id_type?: string;
  click_id_value?: string;
  content?: string;
  landing_hostname?: string;
  landing_path?: string;
  medium?: string;
  source?: string;
  term?: string;
  ts?: string;
}

export interface MarketingLifecycleEvent extends GTMEvent {
  ad_user_data_consent: boolean;
  deployment_id: string | null;
  event: MarketingEventName;
  event_id: string;
  first_touch: MarketingTouchpoint | null;
  gbraid: string | null;
  gclid: string | null;
  hashed_user_data?: MarketingHashedUserData;
  last_touch: MarketingTouchpoint | null;
  occurred_at: string;
  user_id: string | null;
  wbraid: string | null;
  workspace_id: string | null;
}

export interface MarketingHashedUserData {
  email_sha256?: string;
  phone_sha256?: string;
}

export interface MarketingPaymentEvent extends MarketingLifecycleEvent {
  currency: string;
  event: 'new_subscription' | 'topup_success';
  transaction_id: string;
  value: number;
}

export type ButtonActionType =
  | 'url'
  | 'anchor'
  | 'modal'
  | 'custom'
  | 'auth-form';

export const gtmPush = (event: GTMEvent) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
};

export const trackMarketingLifecycleEvent = (
  event: MarketingLifecycleEvent | MarketingPaymentEvent,
) => {
  if (!event.event_id.trim()) {
    throw new Error('Marketing lifecycle events require an event ID.');
  }
  if (Number.isNaN(Date.parse(event.occurred_at))) {
    throw new Error('Marketing lifecycle events require an ISO timestamp.');
  }
  if ([event.gclid, event.gbraid, event.wbraid].filter(Boolean).length > 1) {
    throw new Error('Marketing lifecycle events accept one Google click ID.');
  }
  if (event.hashed_user_data) {
    const identifiers = Object.values(event.hashed_user_data);
    if (
      !event.ad_user_data_consent ||
      identifiers.length === 0 ||
      identifiers.some((value) => !/^[a-f0-9]{64}$/.test(value))
    ) {
      throw new Error('Hashed user data requires consent and SHA-256 values.');
    }
  }
  if ('transaction_id' in event) {
    const { currency, transaction_id: transactionId, value } = event;
    if (typeof currency !== 'string' || !/^[A-Z]{3}$/.test(currency)) {
      throw new Error('Marketing payment currency must use ISO 4217 format.');
    }
    if (
      typeof transactionId !== 'string' ||
      !transactionId.trim() ||
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      value < 0
    ) {
      throw new Error(
        'Marketing payment events require a transaction and value.',
      );
    }
  }
  gtmPush({
    ...event,
    first_touch_json: event.first_touch
      ? JSON.stringify(event.first_touch)
      : '',
    last_touch_json: event.last_touch ? JSON.stringify(event.last_touch) : '',
  });
};

export const trackPageView = (
  context: string,
  pagePath: string,
  pageTitle?: string,
) => {
  gtmPush({
    context,
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
  });
};

export const trackButtonClick = (
  context: string,
  buttonText: string,
  buttonLocation: string,
  actionType: ButtonActionType,
  actionTarget: string,
  additionalData?: Record<string, unknown>,
) => {
  gtmPush({
    context,
    event: 'button_click',
    button_text: buttonText,
    button_location: buttonLocation,
    action_type: actionType || '',
    action_target: actionTarget || '',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_title: typeof window !== 'undefined' ? document.title : '',
    ...additionalData,
  });
};

export const trackVideoEvent = (
  context: string,
  action: 'play' | 'pause' | 'complete' | 'seek',
  videoTitle: string,
  videoUrl: string,
  videoPosition?: number,
) => {
  gtmPush({
    context,
    event: 'video_interaction',
    video_action: action,
    video_title: videoTitle,
    video_url: videoUrl,
    video_position: videoPosition,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    page_title: typeof window !== 'undefined' ? document.title : '',
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
};

export const trackFormSubmission = (
  context: string,
  formName: string,
  formLocation: string,
  success: boolean = true,
) => {
  gtmPush({
    context,
    event: 'form_submission',
    form_name: formName,
    form_location: formLocation,
    form_success: success,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    page_title: typeof window !== 'undefined' ? document.title : '',
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
};

export const trackDownload = (
  context: string,

  fileName: string,
  fileUrl: string,
  downloadLocation: string,
) => {
  gtmPush({
    context,
    event: 'file_download',
    file_name: fileName,
    file_url: fileUrl,
    download_location: downloadLocation,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    page_title: typeof window !== 'undefined' ? document.title : '',
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
};

export const trackCustomEvent = (
  context: string,

  eventName: string,
  eventData: Record<string, unknown>,
) => {
  gtmPush({
    context,
    event: eventName,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    page_title: typeof window !== 'undefined' ? document.title : '',
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    ...eventData,
  });
};

export const trackScrollDepth = (
  context: string,
  percentage: number,
  pagePath: string,
) => {
  gtmPush({
    context,
    event: 'scroll_depth',
    scroll_percentage: percentage,
    page_path: pagePath,
    page_title: typeof window !== 'undefined' ? document.title : '',
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
};

export const trackSearch = (
  context: string,
  searchTerm: string,
  searchLocation: string,
  resultsCount?: number,
) => {
  gtmPush({
    context,
    event: 'search',
    search_term: searchTerm,
    search_location: searchLocation,
    search_results_count: resultsCount,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    page_title: typeof window !== 'undefined' ? document.title : '',
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
};
