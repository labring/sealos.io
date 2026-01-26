import { siteConfig } from '@/config/site';

/**
 * User info from shared auth verification
 */
export interface SharedAuthUser {
  userId: string;
  userUid: string;
  workspaceId?: string;
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
  desktopDomain?: string,
): Promise<SharedAuthUser | null> => {
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
