declare global {
  interface Window {
    dataLayer: Array<Record<string, any>>;
  }
}

export {};
