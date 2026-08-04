/**
 * @typedef {{ url: string }} FAQSlugPage
 */

/**
 * @param {FAQSlugPage} page
 * @returns {string}
 */
export function getFAQPageSlug(page) {
  return page.url.split('/').filter(Boolean).pop() || '';
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function normalizeFAQSlug(slug) {
  return slug.replace(/^\d+-/, '');
}

/**
 * Resolve a FAQ page without allowing a normalized slug to select a
 * different numbered entry.
 *
 * @template {FAQSlugPage} T
 * @param {readonly T[]} pages
 * @param {string} slug
 * @returns {T | undefined}
 */
export function resolveFAQPageBySlug(pages, slug) {
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
