'use client';

import Script from 'next/script';
import { useCallback } from 'react';
import { appDomain, siteConfig } from '@/config/site';

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleAccountsId = {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  prompt: () => void;
};

type OneTapLoginResponse = {
  code: number;
  data?: {
    token?: string;
    needInit?: boolean;
  };
};

function buildOneTapRedirectUrl(data: { token: string; needInit?: boolean }) {
  const target = new URL(siteConfig.googleOneTap.redirectUrl || appDomain);
  if (target.pathname === '/') {
    target.pathname = '/oauth';
  }

  target.searchParams.append('token', data.token);
  if (data.needInit) {
    target.searchParams.append('switchRegionType', 'INIT');
    target.searchParams.append('workspaceName', 'My Workspace');
  }

  return target.toString();
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

export function GoogleOneTap() {
  const handleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential) {
        return;
      }

      try {
        const result = await fetch(siteConfig.googleOneTap.loginEndpoint, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: response.credential,
          }),
        });

        const data: OneTapLoginResponse = await result.json();

        if (result.ok && data.code === 200 && data.data?.token) {
          window.location.href = buildOneTapRedirectUrl({
            token: data.data.token,
            needInit: data.data.needInit,
          });
        }
      } catch (error) {
        console.error('Failed to complete Google One Tap login:', error);
      }
    },
    [],
  );

  const initializeGoogleOneTap = useCallback(() => {
    if (
      !siteConfig.googleOneTap.enabled ||
      !siteConfig.googleOneTap.clientId ||
      !window.google?.accounts?.id
    ) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: siteConfig.googleOneTap.clientId,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.prompt();
  }, [handleCredentialResponse]);

  if (!siteConfig.googleOneTap.enabled || !siteConfig.googleOneTap.clientId) {
    return null;
  }

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={initializeGoogleOneTap}
    />
  );
}
