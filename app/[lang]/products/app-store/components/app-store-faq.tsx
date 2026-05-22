'use client';

import { Lightbulb } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqItems } from '@/app/[lang]/(home)/pricing/config/faqs';

export default function AppStoreFAQ() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mb-14">
        <h2 className="text-4xl leading-10 font-semibold text-balance">
          <span className="bg-gradient-to-r from-white to-[#146dff] bg-clip-text text-transparent">
            Got Questions?
          </span>
        </h2>
        <p className="mt-6 text-base text-zinc-400">
          Everything you need to know about Sealos pricing
        </p>
      </div>

      <Accordion
        type="single"
        defaultValue="faq-0"
        collapsible
        className="overflow-hidden rounded-xl border border-white/15 bg-background/70"
      >
        {faqItems.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`faq-${index}`}
            className="border-white/15 transition-colors data-[state=open]:bg-white/[0.05]"
          >
            <AccordionTrigger
              className="px-5 py-7 text-left text-base font-normal text-white hover:no-underline sm:px-8 sm:text-lg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-zinc-500 [&[data-state=open]>svg]:text-[#146DFF]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Lightbulb className="h-5 w-5 shrink-0 text-zinc-300" />
                <span>{item.question}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-7 text-sm leading-6 text-zinc-400 sm:px-8">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
