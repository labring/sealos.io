'use client';

import { useState, useCallback, useRef } from 'react';
import { ChevronDownIcon, ListIcon } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { FAQList } from './FAQList';
import { useFAQSearch, type FAQData } from './FAQSearch';
import NoResultImage from '@/assets/no-result.svg';

interface FAQPageClientProps {
  lang: string;
  langPrefix: string;
}

const ITEMS_PER_PAGE = 12;

export function FAQPageClient({ lang, langPrefix }: FAQPageClientProps) {
  const [filteredFAQs, setFilteredFAQs] = useState<FAQData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const setCurrentPageRef = useRef<((page: number) => void) | null>(null);

  // Create stable callback that doesn't reset page automatically
  // Page reset is handled inside the hook when search/category changes
  const handleFilteredFAQsChange = useCallback(
    (faqs: FAQData[], total: number) => {
      setFilteredFAQs(faqs);
      setTotalCount(total);
    },
    [],
  );

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    loading,
    isSearching,
    currentPage: searchCurrentPage,
    setCurrentPage: setSearchCurrentPage,
  } = useFAQSearch({
    lang,
    onFilteredFAQsChange: handleFilteredFAQsChange,
  });

  // Store setCurrentPage ref
  setCurrentPageRef.current = setSearchCurrentPage;

  const currentPage = searchCurrentPage;

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setSearchCurrentPage(1);
    },
    [setSelectedCategory, setSearchCurrentPage],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setSearchCurrentPage(1);
    },
    [setSearchQuery, setSearchCurrentPage],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setSearchCurrentPage],
  );

  return (
    <>
      <div className="border-gradient-glass mx-auto mt-11 flex max-w-2xl rounded-xl p-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-full w-fit shrink-0 items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5">
            <span>{selectedCategory}</span>
            <ChevronDownIcon size={16} />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-3 my-2 border-r" />

        <input
          type="text"
          placeholder="Search questions"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-transparent outline-none"
        />
      </div>

      <section className="relative container mt-14 min-h-[calc(100vh-800px)] pt-11">
        {/* Loading overlay - shown during any network request */}
        {(loading || isSearching) && (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="size-6 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
              <span className="text-sm text-white/90">
                {isSearching ? 'Searching...' : 'Loading...'}
              </span>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <div className="text-muted-foreground mb-8 flex items-center gap-2">
              <ListIcon size={16} />
              <span>
                Showing {filteredFAQs.length} question
                {filteredFAQs.length !== 1 ? 's' : ''}
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </span>
            </div>

            {/* Empty state only when not searching */}
            {!isSearching && filteredFAQs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Image
                  src={NoResultImage}
                  alt="No results"
                  width={200}
                  height={200}
                  className="mb-6"
                />
                <p className="text-foreground mb-2 text-lg font-medium">
                  No related questions found.
                </p>
                <p className="text-muted-foreground text-sm">
                  Try changing your search term?
                </p>
              </div>
            ) : (
              <>
                {/* List stays rendered while searching */}
                <div>
                  <FAQList faqs={filteredFAQs} langPrefix={langPrefix} />
                </div>

                {totalPages > 1 && (
                  <div className={`mt-12 flex justify-center`}>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1 && !isSearching) {
                                handlePageChange(currentPage - 1);
                              }
                            }}
                            className={
                              currentPage === 1 || isSearching
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>

                        {getPageNumbers().map((page, index) => {
                          if (page === 'ellipsis') {
                            return (
                              <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!isSearching) {
                                    handlePageChange(page);
                                  }
                                }}
                                isActive={currentPage === page}
                                className={
                                  isSearching
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                                }
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages && !isSearching) {
                                handlePageChange(currentPage + 1);
                              }
                            }}
                            className={
                              currentPage === totalPages || isSearching
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
