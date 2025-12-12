'use client';

import { ComparisonConfig } from '../../config/platforms';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

const faqs = [
  {
    question:
      'How much can I actually save by switching from Railway to Sealos?',
    answer: (
      <div className="space-y-4">
        <p>
          For always-on production workloads, savings typically range from
          60-70%.
        </p>
        <p>
          Here's an example calculation for a medium app (8 vCPU, 16GB RAM,
          24/7):
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="px-3 py-2 text-left">Cost Component</th>
                <th className="px-3 py-2 text-right">Railway</th>
                <th className="px-3 py-2 text-right">Sealos Standard</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="px-3 py-2">Compute (monthly)</td>
                <td className="px-3 py-2 text-right">~$300</td>
                <td className="px-3 py-2 text-right">Included</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="px-3 py-2">50GB storage</td>
                <td className="px-3 py-2 text-right">$12.50</td>
                <td className="px-3 py-2 text-right">Included</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="px-3 py-2">100GB egress</td>
                <td className="px-3 py-2 text-right">$5.00</td>
                <td className="px-3 py-2 text-right">Included</td>
              </tr>
              <tr className="font-semibold">
                <td className="px-3 py-2">Total</td>
                <td className="px-3 py-2 text-right">~$317/mo</td>
                <td className="px-3 py-2 text-right">~$100/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-400">
          The more resources you use, the more you save. Railway's per-second
          billing is great for sporadic workloads, but for production apps
          running continuously, fixed plans win.
        </p>
      </div>
    ),
  },
  {
    question: 'Do I need a credit card to get started?',
    answer: (
      <p>
        No credit card required for Sealos free trial. You can start with 7 days
        free trial with 4 vCPU + 4GB RAM.
      </p>
    ),
  },
  {
    question: 'Can I change or cancel my plan at any time?',
    answer: (
      <p>
        Yes, you can upgrade, downgrade, or cancel your plan at any time.
        Changes take effect immediately.
      </p>
    ),
  },
  {
    question: 'What payment methods do you accept?',
    answer: (
      <p>
        We accept major credit cards, PayPal, and other common payment methods.
        Enterprise customers can arrange invoicing.
      </p>
    ),
  },
  {
    question: 'Can I upgrade or downgrade at any time?',
    answer: (
      <p>
        Yes, you can change your plan at any time. Upgrades take effect
        immediately, and downgrades take effect at the next billing cycle.
      </p>
    ),
  },
  {
    question: 'Can I deploy with my own domain?',
    answer: (
      <p>
        Yes, both platforms support custom domains. Sealos offers unlimited
        custom domains, while Railway offers 2 on Hobby plan and 20 on Pro plan.
      </p>
    ),
  },
];

export function FAQSection({ firstPlatform, secondPlatform }: FAQSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-3xl font-bold">Got Questions?</h2>
        <p className="text-muted-foreground">
          Everything you need to know about {firstPlatform.name}.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
