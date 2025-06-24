import { appsConfig } from '@/config/apps';
import { templateDomain } from '@/config/site';
import { languagesType } from '@/lib/i18n';
import AppGrid from '@/components/app-store/app-grid';

interface HighlightedAppsProps {
  lang: languagesType;
}

export default function HighlightedApps({ lang }: HighlightedAppsProps) {
  // Use static apps for initial render to avoid build issues
  const apps = appsConfig;

  return (
    <section className="py-16">
      {/* Section Title */}
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Featured Applications
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">
          Deploy production-ready applications with one click. From databases to
          development tools.
        </p>
      </div>

      {/* Render client component with initial data */}
      <AppGrid lang={lang} initialApps={apps} templateDomain={templateDomain} />
    </section>
  );
}