import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

interface BlogFooterProps {
  adjacentPosts: {
    previous:
      | {
          name: string;
          url: string;
        }
      | undefined;
    next:
      | {
          name: string;
          url: string;
        }
      | undefined;
  };
}

export function BlogFooter({ adjacentPosts }: BlogFooterProps) {
  const { previous, next } = adjacentPosts;

  return (
    <div className="flex flex-row items-center justify-between gap-4 font-medium">
      {previous ? (
        <Link href={previous.url}>
          <div className="bg-primary-foreground hover:border-primary flex flex-col gap-3 rounded-xl border p-4 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <ArrowLeftIcon className="text-muted-foreground size-4" />
              <span>{previous.name}</span>
            </div>
            <div className="text-muted-foreground text-xs">Previous Page</div>
          </div>
        </Link>
      ) : null}
      {next ? (
        <Link href={next.url}>
          <div className="bg-primary-foreground hover:border-primary flex flex-col gap-3 rounded-xl border p-4 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <span>{next.name}</span>
              <ArrowRightIcon className="text-muted-foreground size-4" />
            </div>
            <div className="text-muted-foreground justify-end text-end text-xs">
              Next Page
            </div>
          </div>
        </Link>
      ) : null}
    </div>
  );
}
