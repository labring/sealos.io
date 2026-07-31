import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const sourceDirectory = resolve('content/ai-quick-reference');
const sourceSuffix = '.en.json';

export async function loadFAQPages() {
  const sourceFiles = (await readdir(sourceDirectory))
    .filter((file) => file.endsWith(sourceSuffix))
    .sort();

  return Promise.all(
    sourceFiles.map(async (file) => {
      const slug = file.slice(0, -sourceSuffix.length);
      return {
        slug,
        url: `/ai-quick-reference/${slug}`,
        data: JSON.parse(
          await readFile(resolve(sourceDirectory, file), 'utf8'),
        ),
      };
    }),
  );
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
