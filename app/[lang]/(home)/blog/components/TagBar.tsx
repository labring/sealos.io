'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Tag, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

const VISIBLE_COUNT = 10;

type TagsBarProps = {
  tags?: string[];
};

const formatTitle = (tag: string) =>
  tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const tagClassName = (isSelected: boolean) =>
  cn(
    'rounded-lg border px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors text-primary bg-primary/5 border-dashed flex gap-1 items-center',
    isSelected
      ? 'border-muted-foreground'
      : 'border-border hover:border-muted-foreground',
  );

const buildPath = (pathname: string, params: URLSearchParams) => {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

function TagsBarSkeleton() {
  return (
    <div className="relative mt-6 w-full">
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <Tag className="text-muted-foreground h-4 w-4" />
          <h4 className="text-muted-foreground text-sm font-medium whitespace-nowrap">
            Filter by Tags
          </h4>
        </div>
        <div className="border-muted-foreground/20 h-6 border-l" />
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className={cn(tagClassName(true), 'animate-pulse opacity-70')}>
            All Tags
          </div>
        </div>
      </div>
    </div>
  );
}

function TagsBarContent({ tags = [] }: TagsBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const expandableRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);

  const selectedTags = useMemo(
    () => searchParams.getAll('tag'),
    [searchParams],
  );

  const visibleTags = tags.slice(0, VISIBLE_COUNT);
  const expandableTags = tags.slice(VISIBLE_COUNT);
  const hasMoreTags = expandableTags.length > 0;

  const updateQueryWithTags = (nextTags: string[]) => {
    const params = new URLSearchParams(searchParams);
    params.delete('tag');
    nextTags.forEach((tag) => params.append('tag', tag));
    router.push(buildPath(pathname, params));
  };

  const toggleTag = (tag: string) => {
    const nextTags = new Set(selectedTags);
    nextTags.has(tag) ? nextTags.delete(tag) : nextTags.add(tag);
    updateQueryWithTags(Array.from(nextTags));
  };

  const clearTags = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('tag');
    router.push(buildPath(pathname, params));
    setExpanded(false);
  };

  useEffect(() => {
    const height = expandableRef.current?.scrollHeight ?? 0;
    setPanelHeight(height);
  }, [expandableTags.length, expanded]);

  const renderTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    return (
      <button
        key={tag}
        onClick={() => toggleTag(tag)}
        className={tagClassName(isSelected)}
      >
        {isSelected && <div className="size-1.5 rounded-full bg-blue-400" />}
        {formatTitle(tag)}
      </button>
    );
  };

  return (
    <div className="relative mt-6 w-full">
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <Tag className="text-muted-foreground h-4 w-4" />
          <h4 className="text-muted-foreground text-sm font-medium whitespace-nowrap">
            Filter by Tags
          </h4>
        </div>

        <div className="border-muted-foreground/20 h-6 border-l"></div>

        <div className="relative flex-1">
          {selectedTags.length > 0 && (
            <button
              onClick={clearTags}
              className="text-muted-foreground hover:bg-accent absolute right-2 z-20 flex items-center gap-1 rounded-md px-2 py-1 text-xs"
            >
              <X className="h-3 w-3" />
              <span>Clear</span>
            </button>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={clearTags}
              className={tagClassName(selectedTags.length === 0)}
            >
              All Tags
            </button>

            {visibleTags.map(renderTag)}

            {hasMoreTags && (
              <button
                onClick={() => setExpanded(!expanded)}
                className={cn(
                  tagClassName(expanded),
                  'flex items-center gap-1 px-2.5',
                )}
                aria-expanded={expanded}
              >
                {expanded ? 'Less' : 'More'}
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform',
                    expanded && 'rotate-180',
                  )}
                />
              </button>
            )}
          </div>

          {hasMoreTags && (
            <div
              ref={expandableRef}
              className={cn(
                'flex flex-wrap gap-2 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
                expanded ? 'mt-2 opacity-100' : 'mt-0 opacity-0',
              )}
              style={{ maxHeight: expanded ? panelHeight : 0 }}
            >
              {expandableTags.map(renderTag)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Tag filter bar; must be inside Suspense when using useSearchParams (e.g. static export). */
export default function TagsBar(props: TagsBarProps) {
  return (
    <Suspense fallback={<TagsBarSkeleton />}>
      <TagsBarContent {...props} />
    </Suspense>
  );
}
