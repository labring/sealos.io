import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

interface ArticlePagerProps {
  adjacentItems: {
    previous?: {
      name: string;
      url: string;
    };
    next?: {
      name: string;
      url: string;
    };
  };
  ariaLabel?: string;
  nextLabel?: string;
  previousLabel?: string;
}

export function ArticlePager({
  adjacentItems,
  ariaLabel = 'Adjacent articles',
  nextLabel = 'Next Page',
  previousLabel = 'Previous Page',
}: ArticlePagerProps): JSX.Element {
  const { previous, next } = adjacentItems;

  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-row items-center justify-between gap-4 font-medium"
    >
      {previous ? (
        <Link href={previous.url} className="w-full">
          <div className="bg-primary-foreground hover:border-primary flex flex-col gap-3 rounded-xl border p-4 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <div className="w-4">
                <ArrowLeftIcon className="text-muted-foreground size-4" />
              </div>
              <div className="line-clamp-2">{previous.name}</div>
            </div>
            <div className="text-muted-foreground text-xs">{previousLabel}</div>
          </div>
        </Link>
      ) : null}
      {next ? (
        <Link href={next.url} className="w-full">
          <div className="bg-primary-foreground hover:border-primary flex flex-col gap-3 rounded-xl border p-4 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <div className="line-clamp-2">{next.name}</div>
              <div className="w-4">
                <ArrowRightIcon className="text-muted-foreground size-4" />
              </div>
            </div>
            <div className="text-muted-foreground justify-end text-end text-xs">
              {nextLabel}
            </div>
          </div>
        </Link>
      ) : null}
    </nav>
  );
}
