'use client';

import { FAQCard } from '@/new-components/FAQCard';
import { cn } from '@/lib/utils';

interface FAQData {
  category: string;
  question: string;
  description: string;
  slug: string;
}

interface FAQListProps {
  faqs: FAQData[];
  langPrefix: string;
  className?: string;
}

export function FAQList({ faqs, langPrefix, className }: FAQListProps) {
  if (faqs.length === 0) {
    return (
      <div className={cn('text-muted-foreground py-20 text-center', className)}>
        No FAQs found.
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {faqs.map((faq) => (
        <FAQCard
          key={faq.slug}
          tag={{
            label: faq.category,
            color: 'bg-blue-400',
          }}
          title={faq.question}
          description={faq.description}
          href={`${langPrefix}/ai-quick-reference/${faq.slug}`}
        />
      ))}
    </div>
  );
}
