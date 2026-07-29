'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { faqItems } from '../config/faqs';

interface FAQSectionProps {
  className?: string;
}

export function FAQSection({ className }: FAQSectionProps) {
  return (
    <section
      className={cn(
        'container grid gap-12 py-20 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20 lg:py-28',
        className,
      )}
    >
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="flex items-center gap-2 text-sm font-medium text-blue-400">
          <span className="size-1.5 bg-blue-400" aria-hidden="true" />
          Pricing FAQ
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">
          Questions before you choose a plan
        </h2>
        <p className="text-muted-foreground mt-5 max-w-sm text-base leading-7 text-pretty">
          Plan limits, billing boundaries, upgrades, and payment details.
        </p>
      </div>

      <div className="w-full">
        <Accordion
          type="single"
          defaultValue="item-0"
          collapsible
          className="border-t border-white/15"
        >
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-white/15"
            >
              <AccordionTrigger className="text-foreground [&>svg]:text-muted-foreground gap-5 px-0 py-7 text-left text-base font-medium hover:no-underline focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950 sm:text-lg [&>svg]:size-5">
                <span className="flex items-baseline gap-4">
                  <span className="text-muted-foreground text-xs font-normal tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{item.question}</span>
                </span>
              </AccordionTrigger>
              {item.answer && (
                <AccordionContent className="text-muted-foreground pr-0 pb-8 pl-9 text-sm leading-7">
                  {item.answer}
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
