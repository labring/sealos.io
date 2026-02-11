import { handleAppsRequest } from '@/lib/api/apps-api';
import { LANGUAGES, type languagesType } from '@/lib/i18n';

function resolveLang(segments: string[] | undefined): languagesType {
  const lang = segments?.[0];
  if (lang && LANGUAGES.includes(lang as languagesType)) {
    return lang as languagesType;
  }
  return 'en';
}

/** Static paths: /api/apps (default) and /api/apps/[lang] for each language. */
export async function generateStaticParams(): Promise<
  Array<{ lang?: string[] }>
> {
  return [{}, ...LANGUAGES.map((lang) => ({ lang: [lang] }))];
}

export async function GET(
  _request: Request,
  { params }: { params: { lang?: string[] } },
) {
  const lang = resolveLang(params.lang);
  return handleAppsRequest(lang);
}
