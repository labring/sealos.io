'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';

export interface FAQData {
  category: string;
  question: string;
  description: string;
  slug: string;
}

interface FAQSearchProps {
  onFilteredFAQsChange: (faqs: FAQData[], total: number) => void;
}

const ITEMS_PER_PAGE = 12;

// Debounce function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function useFAQSearch({ onFilteredFAQsChange }: FAQSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [allFAQs, setAllFAQs] = useState<FAQData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Load FAQs from JSON file
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const response = await fetch('/ai-faqs.en.json');
        if (response.ok) {
          const data: FAQData[] = await response.json();
          setAllFAQs(data);

          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.map((faq) => faq.category)),
          ).sort();
          setCategories(['All Categories', ...uniqueCategories]);
        }
      } catch (error) {
        console.error('Error loading FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFAQs();
  }, []);

  // Filter and search function
  const filterAndSearch = useCallback(
    (query: string, category: string, page: number) => {
      // Step 1: Filter by category
      const categoryFiltered =
        category === 'All Categories'
          ? allFAQs
          : allFAQs.filter((faq) => faq.category === category);

      // Step 2: Search within filtered results
      let results: FAQData[];
      if (query.trim()) {
        const fuse = new Fuse(categoryFiltered, {
          keys: ['question', 'description'],
          threshold: 0.3,
        });
        results = fuse.search(query).map((result) => result.item);
      } else {
        results = categoryFiltered;
      }

      // Step 3: Paginate
      const total = results.length;
      const start = (page - 1) * ITEMS_PER_PAGE;
      const paginatedResults = results.slice(start, start + ITEMS_PER_PAGE);

      onFilteredFAQsChange(paginatedResults, total);
    },
    [allFAQs, onFilteredFAQsChange],
  );

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce(filterAndSearch, 300),
    [filterAndSearch],
  );

  // Handle search query changes
  useEffect(() => {
    if (!loading && allFAQs.length > 0) {
      setCurrentPage(1);
      if (searchQuery.trim()) {
        debouncedSearch(searchQuery, selectedCategory, 1);
      } else {
        filterAndSearch('', selectedCategory, 1);
      }
    }
  }, [
    searchQuery,
    selectedCategory,
    loading,
    allFAQs,
    filterAndSearch,
    debouncedSearch,
  ]);

  // Handle page changes
  useEffect(() => {
    if (!loading && allFAQs.length > 0) {
      filterAndSearch(searchQuery, selectedCategory, currentPage);
    }
  }, [
    currentPage,
    loading,
    allFAQs,
    searchQuery,
    selectedCategory,
    filterAndSearch,
  ]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    loading,
    currentPage,
    setCurrentPage,
  };
}
