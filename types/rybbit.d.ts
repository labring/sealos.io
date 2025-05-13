interface Rybbit {
  /**
   * Tracks a page view
   */
  pageview: () => void;

  /**
   * Tracks a custom event
   * @param name Name of the event
   * @param properties Optional properties for the event
   */
  event: (name: string, properties?: Record<string, any>) => void;
}

declare global {
  interface Window {
    rybbit: Rybbit;
  }
}

export {};
