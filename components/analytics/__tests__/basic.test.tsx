import React from 'react';
import { render } from '@testing-library/react';

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript({ children, id, ...props }: any) {
    return <script data-testid={id} {...props}>{children}</script>;
  };
});

// Mock analytics config with a simple object
const mockAnalyticsConfig = {
  gtm: {
    containerId: 'GTM-TEST123',
    enabled: true,
  },
  clarity: {
    trackingId: 'test-clarity-id',
    enabled: true,
  },
  baidu: {
    trackingId: 'test-baidu-id',
    enabled: true,
  },
};

// Mock the analytics config module
jest.doMock('../../../config/analytics', () => ({
  analyticsConfig: mockAnalyticsConfig,
}));

// Import Analytics component after mocks
const { Analytics } = require('../index');

describe('Analytics Component - Basic Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Reset window properties
    delete (window as any).dataLayer;
    delete (window as any).gtag;
    delete (window as any).clarity;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render without crashing', () => {
    expect(() => {
      render(<Analytics />);
    }).not.toThrow();
  });

  it('should render GTM noscript fallback when enabled', () => {
    render(<Analytics />);

    const noscript = document.querySelector('noscript');
    expect(noscript).toBeTruthy();

    if (noscript) {
      const iframe = noscript.querySelector('iframe');
      expect(iframe).toBeTruthy();
      if (iframe) {
        expect(iframe.getAttribute('src')).toContain('GTM-TEST123');
      }
    }
  });

  it('should initialize dataLayer for GTM after delay', () => {
    render(<Analytics />);
    
    // Trigger analytics loading by advancing time
    jest.advanceTimersByTime(3000);
    
    expect(window.dataLayer).toBeDefined();
    expect(Array.isArray(window.dataLayer)).toBe(true);
  });

  it('should not load analytics scripts immediately', () => {
    const { container } = render(<Analytics />);
    
    // Should not have any analytics scripts initially
    expect(container.querySelector('[data-testid="baidu-analytics"]')).toBeNull();
    expect(container.querySelector('[data-testid="google-analytics"]')).toBeNull();
  });
});
