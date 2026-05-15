'use client';

import { useCallback } from 'react';
import { siteConfig } from '@/config/site';
import { verifySharedAuth } from '@/lib/utils/shared-auth';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';

export function buildAuthRedirectUrl(params?: Record<string, string>) {
  const target = new URL(siteConfig.oauth2Url);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      target.searchParams.append(key, value);
    });
  }

  return target.toString();
}

export function useAuthRedirect() {
  const openAuthForm = useOpenAuthForm();

  return useCallback(
    async (params?: Record<string, string>) => {
      const user = await verifySharedAuth();

      if (user) {
        window.location.href = buildAuthRedirectUrl(params);
        return;
      }

      openAuthForm(params);
    },
    [openAuthForm],
  );
}
