type CatalogApp = {
  name: string;
  slug: string;
  icon?: string;
};

export type AppsSectionLogoItem = {
  label: string;
  icon?: string;
  isMore?: boolean;
};

const featuredAppSlugs = ['dify', 'appsmith', 'fastgpt', 'n8n', 'supabase'];

export function getAppsSectionCards<T extends CatalogApp>(
  apps: T[],
  slugs = featuredAppSlugs,
) {
  const bySlug = new Map(apps.map((app) => [app.slug, app]));

  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((app): app is T => Boolean(app));
}

export function getAppsSectionLogoRows(
  apps: CatalogApp[],
  rowSize = Math.ceil((apps.length + 1) / 3),
) {
  const items: AppsSectionLogoItem[] = apps
    .filter((app) => Boolean(app.icon))
    .map((app) => ({
      label: app.name,
      icon: app.icon,
    }));

  items.push({
    label: '200+ More',
    isMore: true,
  });

  return Array.from({ length: Math.ceil(items.length / rowSize) }, (_, index) =>
    items.slice(index * rowSize, index * rowSize + rowSize),
  );
}
