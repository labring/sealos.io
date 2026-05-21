import { appsConfig } from '@/config/apps';
import { languagesType } from '@/lib/i18n';
import AppGrid from '@/components/app-store/app-grid';

interface HighlightedAppsProps {
  lang: languagesType;
}

export default function HighlightedApps({ lang }: HighlightedAppsProps) {
  // Use static apps for initial render to avoid build issues
  const apps = appsConfig;

  return (
    <>
      <AppGrid lang={lang} initialApps={apps} />
    </>
  );
}
