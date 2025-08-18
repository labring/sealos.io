import { handleAppsRequest } from '@/lib/api/apps-api';

/**
 * Generate static params for default language
 */
export async function generateStaticParams(): Promise<Array<{}>> {
  // Generate static version for default language (no lang parameter)
  return [{}];
}

export async function GET() {
  // Default to English when no language is specified
  return handleAppsRequest('en');
}
