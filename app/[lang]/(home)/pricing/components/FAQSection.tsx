'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { GradientText } from '@/new-components/GradientText';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Is there a free Trial of Sealos？',
    answer:
      "Yes! Sealos offers a free Trial that includes 4GB RAM, 4 vCPU and limited AI usage. It's perfect for getting started and exploring the platform.",
  },
  {
    question: 'Do I need a credit card to get started？',
    answer: '',
  },
  {
    question: 'Can I change or cancel my plan at any time？',
    answer: '',
  },
  {
    question: 'What payment methods do you accept？',
    answer: '',
  },
  {
    question: 'Can I upgrade or downgrade at any time？',
    answer: '',
  },
  {
    question: 'Can l deploy with my own domain？',
    answer: '',
  },
];

interface FAQSectionProps {
  className?: string;
}

export function FAQSection({ className }: FAQSectionProps) {
  return (
    <section
      className={cn(
        'container flex flex-col items-center gap-16 py-18',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-center text-4xl font-semibold">
          <GradientText>Got Questions?</GradientText>
        </h2>
        <p className="text-muted-foreground w-full max-w-2xl text-center text-base">
          Everything you need to know about Sealos pricing
        </p>
      </div>

      <div className="w-full max-w-4xl">
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
              <AccordionTrigger className="text-foreground [&>svg]:text-muted-foreground px-0 py-8 text-left text-lg font-normal hover:no-underline [&>svg]:size-6">
                {item.question}
              </AccordionTrigger>
              {item.answer && (
                <AccordionContent className="text-muted-foreground pr-0 pb-8 pl-0 text-sm">
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
