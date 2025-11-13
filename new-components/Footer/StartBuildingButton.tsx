'use client';

import Link from 'fumadocs-core/link';
import { useMemo } from 'react';
import { useGTM } from '@/hooks/use-gtm';
import { getBrainUrl } from '@/lib/utils/brain';

export function StartBuildingButton() {
  const { trackButton } = useGTM();
  const targetUrl = useMemo(() => getBrainUrl(), []);

  return (
    <Link
      href={targetUrl}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '54px',
        fontWeight: 500,
        transition: 'colors',
        border: '1px solid #FFF',
        background: 'linear-gradient(191.74deg, #FFFFFF 8.86%, #CECECE 91.87%)',
        boxShadow:
          '0px 4px 6px -2px rgba(255, 255, 255, 0.05), 0px 10px 15px -3px rgba(255, 255, 255, 0.16)',
        color: '#18181B',
        textDecoration: 'none',
      }}
      onClick={() => trackButton('Get Started', 'footer', 'url', targetUrl)}
    >
      <span>Start Building for Free</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M1.33333 6.00065H10.6667M10.6667 6.00065L6 1.33398M10.6667 6.00065L6 10.6673"
          stroke="#18181B"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
