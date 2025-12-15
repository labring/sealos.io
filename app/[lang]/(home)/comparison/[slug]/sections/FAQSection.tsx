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

interface FAQSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

type FAQAnswer = string | React.ReactNode;

interface FAQ {
  question: string;
  answer: FAQAnswer;
}

const faqs: FAQ[] = [
  {
    question:
      'How much can I actually save by switching from Railway to Sealos?',
    answer: `For always-on production workloads, savings typically range from 60-70%.

Here's an example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):

| Cost Component | Railway | Sealos Standard |
|----------------|---------|-----------------|
| Compute (monthly) | ~$300 | Included |
| 50GB storage | $12.50 | Included |
| 100GB egress | $5.00 | Included |
| **Total** | **~$317/mo** | **~$100/mo** |

The more resources you use, the more you save. Railway's per-second billing is great for sporadic workloads, but for production apps running continuously, fixed plans win.`,
  },
  {
    question: 'Do I need a credit card to get started?',
    answer: `No credit card required for Sealos free trial. You can start with 7 days free trial with 4 vCPU + 4GB RAM.`,
  },
  {
    question: 'Can I change or cancel my plan at any time?',
    answer: `Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.`,
  },
  {
    question: 'What payment methods do you accept?',
    answer: `We accept major credit cards, PayPal, and other common payment methods. Enterprise customers can arrange invoicing.`,
  },
  {
    question: 'Can I upgrade or downgrade at any time?',
    answer: `Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.`,
  },
  {
    question: 'Can I deploy with my own domain?',
    answer: `Yes, both platforms support custom domains. Sealos offers unlimited custom domains, while Railway offers 2 on Hobby plan and 20 on Pro plan.`,
  },
];

function renderAnswer(answer: FAQAnswer) {
  if (typeof answer === 'string') {
    return <LightMarkdown>{answer}</LightMarkdown>;
  }
  return <>{answer}</>;
}

export function FAQSection({ firstPlatform, secondPlatform }: FAQSectionProps) {
  return (
    <section className="container mx-auto px-4 pb-16">
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
