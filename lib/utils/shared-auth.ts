import { siteConfig } from '@/config/site';

const SHARED_AUTH_COOKIE_NAME = 'sealos_auth_token';

/**
 * Get shared auth token from Cookie
 */
export const getSharedAuthToken = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === SHARED_AUTH_COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  return undefined;
};

/**
 * Check if shared auth cookie exists (without verifying validity)
 */
export const hasSharedAuthCookie = (): boolean => {
  return !!getSharedAuthToken();
};

/**
 * User info from shared auth verification
 */
export interface SharedAuthUser {
  userId: string;
  userUid: string;
  workspaceId: string;
}

/**
 * API response structure for verifySharedToken
 */
interface VerifySharedTokenResponse {
  code: number;
  message?: string;
  data?: SharedAuthUser;
}

/**
 * Verify shared auth token by calling Desktop API
 */
export const verifySharedAuth = async (
  desktopDomain?: string
): Promise<SharedAuthUser | null> => {
  // Quick check: if no cookie exists, no need to call API
  if (!hasSharedAuthCookie()) {
    return null;
  }

  const endpoint = desktopDomain || siteConfig.desktopApiEndpoint;

  try {
    const response = await fetch(`${endpoint}/api/auth/verifySharedToken`, {
      method: 'GET',
      credentials: 'include', // Important: send cookies cross-origin
    });

    if (!response.ok) {
      return null;
    }

    const data: VerifySharedTokenResponse = await response.json();

    if (data.code === 200 && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error('Failed to verify shared auth:', error);
    return null;
  }
};
