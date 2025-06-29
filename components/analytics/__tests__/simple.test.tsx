import React from 'react';
import { render } from '@testing-library/react';

// Mock analytics config
jest.mock('../../../config/analytics', () => ({
  analyticsConfig: {
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
  },
}));

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript({ children, id, ...props }: any) {
    return <script data-testid={id} {...props}>{children}</script>;
  };
});

// Import Analytics component after mocks
import { Analytics } from '../index';

describe('Analytics Component - Simple Tests', () => {
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

  it('should render GTM noscript fallback', () => {
    render(<Analytics />);

    const noscript = document.querySelector('noscript');
    expect(noscript).toBeTruthy();

    const iframe = noscript?.querySelector('iframe');
    expect(iframe?.getAttribute('src')).toBe('https://www.googletagmanager.com/ns.html?id=GTM-TEST123');
  });

  it('should not load analytics scripts immediately', () => {
    const { container } = render(<Analytics />);

    // Should not have any analytics scripts initially
    expect(container.querySelector('[data-testid="baidu-analytics"]')).toBeNull();
    expect(container.querySelector('[data-testid="google-analytics"]')).toBeNull();
  });

  it('should initialize dataLayer for GTM', () => {
    render(<Analytics />);
    
    // Trigger analytics loading by advancing time
    jest.advanceTimersByTime(3000);
    
    expect(window.dataLayer).toBeDefined();
    expect(Array.isArray(window.dataLayer)).toBe(true);
  });
});
