export interface GTMEvent {
  event: string;
  [key: string]: any;
}

export const gtmPush = (event: GTMEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  gtmPush({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
  });
};

export const trackButtonClick = (
  buttonText: string,
  buttonLocation: string,
  additionalData?: Record<string, any>,
) => {
  gtmPush({
    event: 'button_click',
    button_text: buttonText,
    button_location: buttonLocation,
    ...additionalData,
  });
};

export const trackVideoEvent = (
  action: 'play' | 'pause' | 'complete' | 'seek',
  videoTitle: string,
  videoUrl: string,
  videoPosition?: number,
) => {
  gtmPush({
    event: 'video_interaction',
    video_action: action,
    video_title: videoTitle,
    video_url: videoUrl,
    video_position: videoPosition,
  });
};

export const trackFormSubmission = (
  formName: string,
  formLocation: string,
  success: boolean = true,
) => {
  gtmPush({
    event: 'form_submission',
    form_name: formName,
    form_location: formLocation,
    form_success: success,
  });
};

export const trackDownload = (
  fileName: string,
  fileUrl: string,
  downloadLocation: string,
) => {
  gtmPush({
    event: 'file_download',
    file_name: fileName,
    file_url: fileUrl,
    download_location: downloadLocation,
  });
};

export const trackCustomEvent = (
  eventName: string,
  eventData: Record<string, any>,
) => {
  gtmPush({
    event: eventName,
    ...eventData,
  });
};

export const trackScrollDepth = (percentage: number, pagePath: string) => {
  gtmPush({
    event: 'scroll_depth',
    scroll_percentage: percentage,
    page_path: pagePath,
  });
};

export const trackSearch = (
  searchTerm: string,
  searchLocation: string,
  resultsCount?: number,
) => {
  gtmPush({
    event: 'search',
    search_term: searchTerm,
    search_location: searchLocation,
    search_results_count: resultsCount,
  });
};
