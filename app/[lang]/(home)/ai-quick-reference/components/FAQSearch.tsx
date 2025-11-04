'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

export interface FAQData {
  url: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
}

interface FAQSearchProps {
  lang: string;
  onFilteredFAQsChange: (faqs: FAQData[], total: number) => void;
}

// Debounce function - waits for the last call before executing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function useFAQSearch({ lang, onFilteredFAQsChange }: FAQSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<string>('All Categories');
  const [allFAQs, setAllFAQs] = useState<FAQData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<FAQData[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pendingQueryRef = useRef<string>('');
  const searchInProgressRef = useRef(false);
  const currentPageRef = useRef(1);
  const ITEMS_PER_PAGE = 12;

  // Search function - performs fuzzy search with pagination
  const performSearch = useCallback(
    async (query: string, page: number = 1) => {
      if (searchInProgressRef.current) {
        // If search is in progress, queue the new query
        pendingQueryRef.current = query;
        currentPageRef.current = page;
        return;
      }

      if (!query.trim()) {
        setSearchResults([]);
        setSearchTotal(0);
        setIsSearching(false);
        return;
      }

      searchInProgressRef.current = true;
      setIsSearching(true);

      try {
        const response = await fetch(
          `/api/faq/list?lang=${lang}&q=${encodeURIComponent(query)}&page=${page}&limit=${ITEMS_PER_PAGE}`,
        );
        if (response.ok) {
          const data = await response.json();
          // API returns paginated results
          setSearchResults(data.faqs || []);
          setSearchTotal(data.total || 0);

          // Extract categories from response (always update to ensure consistency)
          if (data.categories) {
            setCategories(['All Categories', ...(data.categories || [])]);
          }
        } else {
          setSearchResults([]);
          setSearchTotal(0);
        }
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to client-side fuzzy search on error
        const queryLower = query.toLowerCase();
        const allResults = allFAQs.filter((faq) => {
          const title = faq.title.toLowerCase();
          const description = faq.description.toLowerCase();
          return (
            title.includes(queryLower) ||
            description.includes(queryLower) ||
            title.split(' ').some((word) => word.startsWith(queryLower)) ||
            description.split(' ').some((word) => word.startsWith(queryLower))
          );
        });
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        setSearchResults(allResults.slice(start, end));
        setSearchTotal(allResults.length);
      } finally {
        setIsSearching(false);
        searchInProgressRef.current = false;

        // Check for pending query after current search completes
        const pending = pendingQueryRef.current;
        const pendingPage = currentPageRef.current;
        if (pending && pending !== query) {
          pendingQueryRef.current = '';
          // Use setTimeout to avoid recursive call issues
          setTimeout(() => {
            performSearch(pending, pendingPage);
          }, 0);
        }
      }
    },
    [allFAQs, lang],
  );

  // Load paginated FAQs based on search and category
  // This is the unified function that handles both search and list
  const loadPaginatedFAQs = useCallback(
    async (page: number) => {
      const currentQuery = searchQuery.trim();

      if (currentQuery) {
        // If searching, use search API
        await performSearch(currentQuery, page);
        return;
      }

      // Otherwise, load from list API with pagination
      setIsSearching(false);
      try {
        const categoryParam =
          selectedCategory !== 'All Categories'
            ? `&category=${encodeURIComponent(selectedCategory)}`
            : '';
        const response = await fetch(
          `/api/faq/list?lang=${lang}&page=${page}&limit=${ITEMS_PER_PAGE}${categoryParam}`,
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.faqs || []);
          setSearchTotal(data.total || 0);

          // Extract categories from response (always update to ensure consistency)
          if (data.categories) {
            setCategories(['All Categories', ...(data.categories || [])]);
          }
        }
      } catch (error) {
        console.error('Error loading FAQs:', error);
        setSearchResults([]);
        setSearchTotal(0);
      }
    },
    [lang, selectedCategory, searchQuery, performSearch],
  );

  // Debounced search function - waits for user to stop typing
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string, page: number) => {
        performSearch(query, page);
      }, 300),
    [performSearch],
  );

  // Load first page of FAQs on mount and when lang/selectedCategory changes
  const loadPaginatedFAQsRef = useRef(loadPaginatedFAQs);
  useEffect(() => {
    loadPaginatedFAQsRef.current = loadPaginatedFAQs;
  }, [loadPaginatedFAQs]);

  // Initial load - load first page and set loading to false after data is loaded
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    currentPageRef.current = 1;
    loadPaginatedFAQsRef.current(1).finally(() => {
      setLoading(false);
    });
  }, [lang, selectedCategory]);

  // Handle search query changes with debouncing
  useEffect(() => {
    if (searchQuery.trim()) {
      setCurrentPage(1);
      currentPageRef.current = 1;
      // Set searching state immediately to show loading overlay
      setIsSearching(true);
      // Don't clear results immediately - keep previous results visible while searching
      // Debounced search will execute after user stops typing
      debouncedSearch(searchQuery, 1);
    } else {
      // When search is cleared, load default list
      setCurrentPage(1);
      currentPageRef.current = 1;
      setIsSearching(false);
      loadPaginatedFAQsRef.current(1);
    }
  }, [searchQuery, debouncedSearch]);

  // Handle page changes - unified for both search and list
  useEffect(() => {
    if (currentPage > 1) {
      currentPageRef.current = currentPage;
      loadPaginatedFAQsRef.current(currentPage);
    }
  }, [currentPage]);

  // Notify parent component of filtered FAQs changes
  // Use ref to avoid dependency on onFilteredFAQsChange
  const onFilteredFAQsChangeRef = useRef(onFilteredFAQsChange);
  useEffect(() => {
    onFilteredFAQsChangeRef.current = onFilteredFAQsChange;
  }, [onFilteredFAQsChange]);

  // Notify parent component whenever results change
  useEffect(() => {
    onFilteredFAQsChangeRef.current(searchResults, searchTotal);
  }, [searchResults, searchTotal]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    loading,
    isSearching,
    currentPage,
    setCurrentPage,
  };
}
