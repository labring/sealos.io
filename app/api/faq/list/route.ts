import { NextRequest, NextResponse } from 'next/server';
import { faqSource } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import {
  getAllFAQs,
  getAllCategories,
  pageToFAQItem,
} from '@/lib/utils/faq-utils';

export const revalidate = false;

// Create search indexes
const searchIndexes = faqSource.getLanguages().flatMap((entry) =>
  entry.pages.map((page) => ({
    title: (page.data.title as string) || '',
    description: (page.data.description as string) || '',
    structuredData: page.data.structuredData,
    category: (page.data as any).category || '',
    keywords: (((page.data as any).keywords as string[]) || []).join(', '),
    id: page.url,
    url: page.url,
    // Search content includes title and description
    content: `${page.data.title || ''} ${page.data.description || ''} [${entry.language}]`,
    // Use tag for language filtering
    tag: entry.language,
  })),
);

// Create search API instance
const searchAPI = createSearchAPI('advanced', {
  indexes: searchIndexes,
  // Use Chinese tokenizer for better Chinese text processing
  components: {
    tokenizer: createTokenizer(),
  },
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get('lang') || 'en';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const category = searchParams.get('category');
  const query = searchParams.get('q') || searchParams.get('query') || '';

  try {
    // Get categories (always needed)
    const categories = getAllCategories(lang);

    // If query is provided, perform search using search method directly
    if (query.trim()) {
      // Use search method directly
      const searchResults = await searchAPI.search(query, {
        tag: lang,
      });

      // Get all FAQs for the language
      const allFAQs = getAllFAQs(lang);

      // Extract result URLs from search results
      const resultUrls = new Set(
        searchResults.map((item: any) => item.id || item.url),
      );

      // Filter FAQs to match search results
      let matchedFAQs = allFAQs.filter((faq) => resultUrls.has(faq.url));

      // Apply category filter if provided
      if (category && category !== 'All Categories') {
        matchedFAQs = matchedFAQs.filter(
          (faq) => (faq.data as any).category === category,
        );
      }

      // Apply pagination
      const total = matchedFAQs.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedFAQs = matchedFAQs.slice(startIndex, endIndex);

      // Convert to FAQ items
      const faqData = paginatedFAQs.map(pageToFAQItem);

      return NextResponse.json({
        faqs: faqData,
        total,
        categories,
        page,
        limit,
      });
    }

    // Otherwise, return list (with optional category filter)
    const allFAQs = getAllFAQs(lang);

    // Filter by category if provided
    let filteredFAQs = allFAQs;
    if (category && category !== 'All Categories') {
      filteredFAQs = allFAQs.filter(
        (page) => (page.data as any).category === category,
      );
    }

    // Calculate pagination
    const total = filteredFAQs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFAQs = filteredFAQs.slice(startIndex, endIndex);

    // Return minimal page data for client-side use
    const faqData = paginatedFAQs.map(pageToFAQItem);

    return NextResponse.json({
      faqs: faqData,
      total,
      categories,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs', faqs: [], total: 0, page, limit },
      { status: 500 },
    );
  }
}
