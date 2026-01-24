'use client';

import { ReactNode } from 'react';
import { AuthFormProvider as BaseAuthFormProvider } from './AuthFormContext';
import { EmailVerifyResponse } from './types';
import { siteConfig } from '@/config/site';

export function AuthFormProvider({ children }: { children: ReactNode }) {
  const handleVerifySuccess = (
    data: EmailVerifyResponse['data'],
    additionalParams?: Record<string, string> | null,
  ) => {
    const target = new URL(siteConfig.oauth2Url);
    target.searchParams.append('token', data.token);
    if (data.needInit) {
      target.searchParams.append('switchRegionType', 'INIT');
      target.searchParams.append('workspaceName', 'My Workspace');
    }

    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        target.searchParams.append(key, value);
      });
    }

    window.location.href = target.toString();
  };

  return (
    <BaseAuthFormProvider onVerifySuccess={handleVerifySuccess}>
      {children}
    </BaseAuthFormProvider>
  );
}
