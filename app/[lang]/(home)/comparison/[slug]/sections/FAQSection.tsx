'use client';

import React from 'react';
import { ComparisonConfig } from '../../config/platforms';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LightMarkdown } from '../components/LightMarkdown';
import { GradientText } from '@/new-components/GradientText';
import { generateFaq } from '../../config/faqs';

interface FAQSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

type FAQAnswer = string | React.ReactNode;

function renderAnswer(answer: FAQAnswer) {
  if (typeof answer === 'string') {
    return <LightMarkdown>{answer}</LightMarkdown>;
  }
  return <>{answer}</>;
}

export function FAQSection({ firstPlatform, secondPlatform }: FAQSectionProps) {
  const faqs = generateFaq(firstPlatform.name, secondPlatform.name);

  return (
    <section className="container mx-auto px-4 pb-16 sm:pb-32">
      <div className="space-y-8">
        <div className="mb-8">
          <h2 className="mb-4 text-center text-3xl font-semibold">
            <GradientText>Got Questions?</GradientText>
          </h2>
          <p className="text-muted-foreground text-center">
            Everything you need to know about {firstPlatform.name} and{' '}
            {secondPlatform.name}.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full border-t">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="my-2 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {renderAnswer(faq.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
