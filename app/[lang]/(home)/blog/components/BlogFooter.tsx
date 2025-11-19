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
        <Link href={previous.url} className="w-full">
          <div className="bg-primary-foreground hover:border-primary flex flex-col gap-3 rounded-xl border p-4 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <div className="w-4">
                <ArrowLeftIcon className="text-muted-foreground size-4" />
              </div>
              <div className="line-clamp-2">{previous.name}</div>
            </div>
            <div className="text-muted-foreground text-xs">Previous Page</div>
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
              Next Page
            </div>
          </div>
        </Link>
      ) : null}
    </div>
  );
}
