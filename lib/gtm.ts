export interface GTMEvent {
  event: string;
  [key: string]: any;
}

export type ButtonActionType = 'url' | 'anchor' | 'modal' | 'custom';

export const gtmPush = (event: GTMEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
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
  additionalData?: Record<string, any>,
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
  eventData: Record<string, any>,
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
