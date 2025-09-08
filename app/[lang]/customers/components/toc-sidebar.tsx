'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { List, ChevronRight, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TocSidebarProps {
  className?: string;
  title?: string;
}

/**
 * Table of Contents sidebar component for case study pages
 * Automatically extracts headings from the page and provides smooth scrolling navigation
 */
export default function TocSidebar({
  className = '',
  title = '目录导航',
}: TocSidebarProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contentBounds, setContentBounds] = useState<{
    top: number;
    bottom: number;
  } | null>(null);

  // Extract headings from the case study content area only
  useEffect(() => {
    const extractHeadings = () => {
      // Find the main content area that contains case study sections
      const contentArea =
        document.querySelector('#case-study-content') ||
        document.querySelector('.space-y-10');
      if (!contentArea) {
        setIsVisible(false);
        return;
      }

      // Only select h2-h6 headings within the content area (exclude h1)
      const headings = contentArea.querySelectorAll('h2, h3, h4, h5, h6');
      const items: TocItem[] = [];

      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const title = heading.textContent || '';

        // Skip empty titles
        if (!title.trim()) return;

        // Create or use existing ID
        let id = heading.id;
        if (!id) {
          id = `content-heading-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          heading.id = id;
        }

        items.push({ id, title, level });
      });

      setTocItems(items);
      setIsVisible(items.length > 0);
    };

    // Extract headings after a short delay to ensure content is rendered
    const timer = setTimeout(extractHeadings, 200);
    return () => clearTimeout(timer);
  }, []);

  // Calculate content area bounds for TOC positioning
  useEffect(() => {
    const calculateContentBounds = () => {
      // Find the main content wrapper (the div with relative class that contains all content)
      const contentWrapper = document.querySelector(
        'main > div.relative:last-child',
      );
      if (contentWrapper) {
        const rect = contentWrapper.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        setContentBounds({
          top: rect.top + scrollTop + 100, // Add some top margin
          bottom: rect.bottom + scrollTop - 100, // Add some bottom margin
        });
      }
    };

    // Calculate bounds after content is loaded
    const timer = setTimeout(calculateContentBounds, 300);

    // Recalculate on window resize and scroll
    const handleUpdate = () => {
      requestAnimationFrame(calculateContentBounds);
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
    };
  }, []);

  // Handle scroll to update active heading
  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for better UX

      let currentActiveId = '';

      for (const item of tocItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            currentActiveId = item.id;
          } else {
            break;
          }
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial active item

    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // Smooth scroll to heading
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  }, []);

  if (!isVisible || tocItems.length === 0) {
    return null;
  }

  // Calculate TOC position - constrain to content area
  const getTocStyle = () => {
    if (contentBounds) {
      const viewportHeight = window.innerHeight;
      const scrollTop = window.pageYOffset;

      // Calculate visible content area
      const contentTop = Math.max(contentBounds.top - scrollTop, 0);
      const contentBottom = Math.min(
        contentBounds.bottom - scrollTop,
        viewportHeight,
      );

      // Only show TOC if content area is visible and has sufficient height
      if (contentBottom - contentTop < 200) {
        return { display: 'none' };
      }

      const tocTop = Math.max(contentTop + 20, 100); // 20px margin from content top, minimum 100px from viewport top
      const maxTocHeight = Math.min(
        contentBottom - tocTop - 20,
        viewportHeight * 0.6,
      ); // 20px margin from content bottom

      return {
        right: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1rem))',
        top: `${tocTop}px`,
        maxHeight: `${maxTocHeight}px`,
        position: 'fixed' as const,
      };
    }

    // Fallback when content bounds not available
    return {
      right: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1rem))',
      top: '200px',
      maxHeight: '50vh',
      position: 'fixed' as const,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('z-40 hidden xl:block', className)}
      style={getTocStyle()}
    >
      <nav className="h-full w-64 overflow-hidden">
        <div className="bg-card/95 border-border/50 overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-foreground hover:bg-accent/10 flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <List className="text-primary h-4 w-4" />
              <span>{title}</span>
            </div>
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="text-muted-foreground h-4 w-4" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent max-h-[50vh] overflow-y-auto px-2 pb-3">
                  <ul className="space-y-0.5">
                    {tocItems.map((item) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          transitionDelay: `${tocItems.indexOf(item) * 0.03}s`,
                        }}
                      >
                        <button
                          onClick={() => scrollToHeading(item.id)}
                          className={cn(
                            'group w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200',
                            'flex items-center gap-1.5',
                            'hover:bg-accent/10 hover:text-primary focus:ring-primary/20 focus:ring-2 focus:ring-offset-1 focus:outline-none',
                            activeId === item.id
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                          style={{
                            // Adjust indentation: h2=12px, h3=24px, h4=36px, etc.
                            paddingLeft:
                              item.level > 2
                                ? `${(item.level - 2) * 12 + 24}px`
                                : '12px',
                          }}
                        >
                          {activeId === item.id && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="bg-primary absolute left-0 h-5 w-1 rounded-r-full"
                              transition={{ duration: 0.2 }}
                            />
                          )}

                          {item.level > 2 && (
                            <ChevronRight
                              className={cn(
                                'h-3 w-3 opacity-50 transition-transform duration-200',
                                'group-hover:text-primary group-hover:opacity-100',
                                activeId === item.id
                                  ? 'text-primary opacity-100'
                                  : '',
                              )}
                            />
                          )}

                          <span className="block truncate" title={item.title}>
                            {item.title}
                          </span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.div>
  );
}
