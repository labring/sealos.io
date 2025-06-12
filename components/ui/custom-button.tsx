'use client';

import { useGTM } from '@/hooks/use-gtm';
import { ButtonActionType } from '@/lib/gtm';
import { ReactNode } from 'react';

type CustomButtonProps = {
  children: ReactNode;
  className?: string;
  title: string;
  type?: 'button' | 'submit' | 'reset';
  actionType?: ButtonActionType;
  onClick?: () => void;
  href?: string;
  location?: string;
  trackingEnabled?: boolean;
  disabled?: boolean;
  newWindow?: boolean;
  additionalData?: Record<string, any>;
};

export function CustomButton({
  children,
  className = '',
  title,
  type = 'button',
  actionType = 'url',
  onClick,
  href,
  location,
  trackingEnabled = true,
  disabled = false,
  newWindow = false,
  additionalData = {},
}: CustomButtonProps) {
  const { trackButton } = useGTM();

  const handleClick = () => {
    if (trackingEnabled && location) {
      trackButton(title, location, actionType, href, additionalData);
    }

    if (onClick) {
      onClick();
    }

    if (href) {
      if (newWindow) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <button
      type={type}
      title={title}
      className={className}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
