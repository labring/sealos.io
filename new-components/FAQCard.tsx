import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { GradientText } from '@/app/[lang]/(home)/(new-home)/components/GradientText';
import { FAQTag } from './FAQTag';
import { cn } from '@/lib/utils';

interface FAQCardProps {
  tag: {
    label: string;
    color?: string;
  };
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function FAQCard({
  tag,
  title,
  description,
  href,
  className,
}: FAQCardProps) {
  return (
    <div
      className={cn(
        'border-border bg-card group flex flex-col gap-4 rounded-xl border p-6 transition-colors hover:border-zinc-700 hover:bg-zinc-900',
        className,
      )}
    >
      <FAQTag label={tag.label} color={tag.color} />

      <div>
        <h3 className="mb-2 line-clamp-1 font-semibold">
          <GradientText>
            <span className="text-foreground transition-colors group-hover:text-transparent">
              {title}
            </span>
          </GradientText>
        </h3>

        <p className="text-muted-foreground line-clamp-3 text-sm">
          {description}
        </p>
      </div>

      <Link href={href} className="flex items-center gap-2 text-sm">
        <span>Read Detail</span>
        <ArrowRightIcon
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
