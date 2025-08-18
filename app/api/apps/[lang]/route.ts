import { handleAppsRequest } from '@/lib/api/apps-api';
import { LANGUAGES, languagesType } from '@/lib/i18n';

/**
 * Generate static params for all supported languages
 */
export async function generateStaticParams(): Promise<
  Array<{ lang: languagesType }>
> {
  return LANGUAGES.map((lang) => ({ lang }));
}

export async function GET(
  request: Request,
  { params }: { params: { lang: languagesType } },
) {
  const { lang } = params;
  const language = lang || 'en';

  return handleAppsRequest(language);
}
