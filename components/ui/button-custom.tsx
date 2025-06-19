'use client';

import { useButtonHandler } from '@/hooks/use-button-handler';
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
  const { handleClick } = useButtonHandler({
    title,
    location: location || '',
    href,
    actionType,
    trackingEnabled,
    newWindow,
    onClick,
    additionalData,
  });

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
