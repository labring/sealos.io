import { source } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';

// Static export requires caching to be disabled
export const revalidate = false;

// Use staticGET for static export compatibility
// Using mixed tokenizer to support both English and Chinese
export const { staticGET: GET } = createSearchAPI('advanced', {
  indexes: source.getLanguages().flatMap((entry) =>
    entry.pages.map((page) => ({
      title: page.data.title || '',
      description: page.data.description || '',
      structuredData: page.data.structuredData,
      id: page.url,
      url: page.url,
      content: `${page.data.title || ''} ${page.data.description || ''} [${entry.language}]`,
      // Use tag for language filtering as a workaround.
      tag: entry.language,
    })),
  ),
  // Use Chinese tokenizer for better Chinese text processing
  components: {
    tokenizer: createTokenizer(),
  },
});
