export interface FAQSlugPage {
  url: string;
}

export function getFAQPageSlug(page: FAQSlugPage): string {
  const segments = page.url.split('/').filter(Boolean);
  return segments[segments.length - 1] || '';
}

export function normalizeFAQSlug(slug: string): string {
  return slug.replace(/^\d+-/, '');
}

/**
 * Resolve a FAQ page without allowing a normalized slug to select a
 * different numbered entry.
 */
export function resolveFAQPageBySlug<T extends FAQSlugPage>(
  pages: readonly T[],
  slug: string,
): T | undefined {
  const exactMatches = pages.filter((page) => getFAQPageSlug(page) === slug);

  if (exactMatches.length === 1) {
    return exactMatches[0];
  }

  if (exactMatches.length > 1 || /^\d+-/.test(slug)) {
    return undefined;
  }

  const normalizedTarget = normalizeFAQSlug(slug);
  const normalizedMatches = pages.filter(
    (page) => normalizeFAQSlug(getFAQPageSlug(page)) === normalizedTarget,
  );

  return normalizedMatches.length === 1 ? normalizedMatches[0] : undefined;
}
