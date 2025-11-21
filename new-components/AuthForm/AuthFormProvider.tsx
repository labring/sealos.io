'use client';

import { ReactNode } from 'react';
import { AuthFormProvider as BaseAuthFormProvider } from './AuthFormContext';
import { EmailVerifyResponse } from './types';
import { siteConfig } from '@/config/site';

export function AuthFormProvider({ children }: { children: ReactNode }) {
  const handleVerifySuccess = (
    data: EmailVerifyResponse['data'],
    additionalParams?: Partial<Record<'openapp', string>> | null,
  ) => {
    const target = new URL(siteConfig.signinSwitchRegionUrl);
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

    window.open(target.toString(), '_blank')?.focus();
  };

  return (
    <BaseAuthFormProvider onVerifySuccess={handleVerifySuccess}>
      {children}
    </BaseAuthFormProvider>
  );
}
