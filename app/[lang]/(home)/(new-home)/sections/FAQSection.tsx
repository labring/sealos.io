'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqData } from '../config/faq-data';

export default function FAQSection() {

  return (
    <div className="container px-4 pt-8 pb-8">
      <div className="flex w-full flex-col items-start justify-between gap-10 lg:flex-row lg:gap-20">
        {/* Left Section */}
        <div className="flex w-full max-w-md flex-col items-start gap-5 pt-5 xl:max-w-lg 2xl:max-w-xl">
          <h2
            className="m-0 mb-6 text-4xl leading-[150%] font-medium text-white"
            aria-label="Frequently Asked Questions"
          >
            <span>Frequently Asked </span>
            <span className="bg-gradient-to-r from-white to-blue-600 bg-clip-text text-4xl leading-[150%] font-medium text-transparent">
              Questions
            </span>
          </h2>
          <p className="m-0 max-w-full text-base leading-6 font-normal text-zinc-400">
            Got questions? We've got answers. Here's everything you need to know
            to get started with confidence.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full flex-1">
          <Accordion type="multiple" className="border-t border-white/10">
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-white/10"
              >
                <AccordionTrigger className="px-3 py-6 text-left text-lg leading-7 font-normal text-white hover:bg-zinc-500/30 hover:text-zinc-200 hover:no-underline [&>svg]:text-zinc-200">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pr-8 pb-6 pl-3 text-sm leading-5 font-normal text-zinc-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
