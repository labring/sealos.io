'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Tag, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function TagsBar({ tags = [], text }: { tags?: string[], text: Record<string, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);

  // Parse selected tags from the URL query parameter
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    // Get all tag parameters as an array
    return searchParams.getAll('tag');
  });

  // Keep selected tags in sync with URL changes
  useEffect(() => {
    const tagsFromUrl = searchParams.getAll('tag');
    setSelectedTags(tagsFromUrl);
  }, [searchParams]);

  // Determine visible and expandable tags
  const visibleCount = 10; // Show this many tags in the main view
  const visibleTags = tags ? tags.slice(0, visibleCount) : [];
  const expandableTags = tags ? tags.slice(visibleCount) : [];
  const hasMoreTags = expandableTags.length > 0;

  const toggleTag = (tag: string) => {
    // Create a new URLSearchParams object based on the current parameters
    const newSearchParams = new URLSearchParams(searchParams);

    // Toggle tag selection logic
    if (selectedTags.includes(tag)) {
      // Remove this tag
      newSearchParams.delete('tag', tag);
    } else {
      // Add this tag
      newSearchParams.append('tag', tag);
    }

    // Preserve the current URL path and update only the query parameters
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const clearTags = () => {
    // Create new search params without tags
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('tag');

    // Preserve the current URL path but remove tag parameters
    router.push(`${pathname}?${newSearchParams.toString()}`);
    setExpanded(false); // Close dropdown after clearing
  };

  return (
    <div className="relative mb-8 mt-2 w-full border-t pt-4">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <h4 className="whitespace-nowrap text-sm font-medium text-muted-foreground">
            {text.filter_tag}
          </h4>
        </div>

        <div className="h-6 border-l border-muted-foreground/20"></div>

        <div className="relative flex-1">
          {selectedTags.length > 0 && (
            <button
              onClick={clearTags}
              className="absolute right-2 z-20 flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
            >
              <X className="h-3 w-3" /> {text.clear}
            </button>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={clearTags}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
                selectedTags.length === 0
                  ? 'border-primary/40 bg-primary/10 font-medium text-primary'
                  : 'border-muted/60 bg-transparent hover:bg-accent/50'
              }`}
            >
              {text.all_tag}
            </button>

            {visibleTags.map((tag) => {
              const tagTitle = tag
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
                    isSelected
                      ? 'border-primary/40 bg-primary/10 font-medium text-primary'
                      : 'border-muted/60 bg-transparent hover:bg-accent/50'
                  }`}
                >
                  {tagTitle}
                  {isSelected && <span className="ml-1 text-xs">✓</span>}
                </button>
              );
            })}

            {hasMoreTags && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-0.5 whitespace-nowrap rounded-full border border-muted/60 px-2 py-1 text-xs transition-colors hover:bg-accent/50"
                aria-expanded={expanded}
              >
                {expanded ? 'Less' : 'More'}{' '}
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${
                    expanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {hasMoreTags && (
            <div
              className={`mt-2 flex flex-wrap gap-1.5 overflow-hidden transition-all duration-300 ${
                expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {expandableTags.map((tag) => {
                const tagTitle = tag
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
                      isSelected
                        ? 'border-primary/40 bg-primary/10 font-medium text-primary'
                        : 'border-muted/60 bg-transparent hover:bg-accent/50'
                    }`}
                  >
                    {tagTitle}
                    {isSelected && <span className="ml-1 text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
