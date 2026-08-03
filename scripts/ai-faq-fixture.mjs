import { loadCanonicalFAQSource } from './ai-faq-index.mjs';

export async function loadFAQPages() {
  const sourceRecords = await loadCanonicalFAQSource();
  return sourceRecords.map(({ slug, data }) => ({
    slug,
    url: `/ai-quick-reference/${slug}`,
    data,
  }));
}

export function groupByNormalizedSlug(pages) {
  const groups = new Map();
  for (const page of pages) {
    const normalizedSlug = page.slug.replace(/^\d+-/, '');
    const group = groups.get(normalizedSlug) || [];
    group.push(page);
    groups.set(normalizedSlug, group);
  }
  return groups;
}
