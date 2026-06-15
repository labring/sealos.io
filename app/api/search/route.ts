import { source } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import type { StructuredData } from 'fumadocs-core/mdx-plugins';

function getHeadingOnlyStructuredData(data: StructuredData): StructuredData {
  return {
    headings: data.headings,
    contents: [],
  };
}

const emptyStructuredData: StructuredData = {
  headings: [],
  contents: [],
};

// Static export requires caching to be disabled
export const revalidate = false;

// Use staticGET for static export compatibility
// Using mixed tokenizer to support both English and Chinese
const tokenizer = createTokenizer();

// Wrap the tokenizer to make it case-insensitive
const originalTokenize = tokenizer.tokenize.bind(tokenizer);
tokenizer.tokenize = (input: string, language?: string, prop?: string) => {
  if (typeof input === 'string') {
    return originalTokenize(input.toLowerCase(), language, prop);
  }
  return originalTokenize(input, language, prop);
};

export const { staticGET: GET } = createSearchAPI('advanced', {
  indexes: source.getLanguages().flatMap((entry) =>
    entry.pages.map((page) => ({
      title: page.data.title || '',
      description: page.data.description || '',
      structuredData: getHeadingOnlyStructuredData(
        page.data.structuredData || emptyStructuredData,
      ),
      id: page.url,
      url: page.url,
      content: `${page.data.title || ''} ${page.data.description || ''} [${entry.language}]`,
      // Use tag for language filtering as a workaround.
      tag: entry.language,
    })),
  ),
  // Use Chinese tokenizer for better Chinese text processing
  components: {
    tokenizer,
  },
});
