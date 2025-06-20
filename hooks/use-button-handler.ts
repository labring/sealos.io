'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGTM } from '@/hooks/use-gtm';
import { ButtonActionType } from '@/lib/gtm';
import { sanitizeForGTM } from '@/lib/gtm-utils';

interface ButtonHandlerOptions {
  title: string;
  location: string;
  href?: string;
  actionType?: ButtonActionType;
  trackingEnabled?: boolean;
  newWindow?: boolean;
  onClick?: () => void;
  additionalData?: Record<string, any>;
}

export function useButtonHandler({
  title,
  location,
  href,
  actionType = 'url',
  trackingEnabled = true,
  newWindow = false,
  onClick,
  additionalData = {},
}: ButtonHandlerOptions) {
  const { trackButton } = useGTM();
  const router = useRouter();

  const handleClick = useCallback(
    (e?: React.MouseEvent) => {
      // Prevent default behavior if needed
      if (e && href) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Track the button click if tracking is enabled
      if (trackingEnabled && location) {
        // Sanitize additionalData to prevent circular references
        const cleanAdditionalData = sanitizeForGTM(additionalData);
        trackButton(
          title,
          location,
          actionType,
          href || '',
          cleanAdditionalData,
        );
      }

      // Call the provided onClick handler if it exists
      if (onClick) {
        onClick();
      }

      // Handle navigation
      if (href) {
        if (newWindow) {
          window.open(href, '_blank', 'noopener,noreferrer');
        } else if (
          href.startsWith('http://') ||
          href.startsWith('https://') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          href.startsWith('ftp://') ||
          href.startsWith('//') // Protocol-relative URLs
        ) {
          // External links or special protocols
          window.location.href = href;
        } else {
          // Internal navigation using Next.js router
          router.push(href);
        }
      }
    },
    [
      title,
      location,
      href,
      actionType,
      trackingEnabled,
      newWindow,
      onClick,
      additionalData,
      trackButton,
      router,
    ],
  );

  return { handleClick };
}
