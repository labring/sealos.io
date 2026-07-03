import { Lightbulb } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { GradientText } from '@/new-components/GradientText';

const faqs = [
  {
    question: 'Do I need to know Kubernetes to use Sealos?',
    answer:
      'No. Sealos hides Kubernetes behind a click-or-talk interface. Power users can still drop down to the native K8s API any time — full compatibility, no abstraction tax.',
  },
  {
    question: 'What can I deploy from a GitHub repo?',
    answer:
      'You can deploy web apps, APIs, workers, and services from common GitHub repositories. Sealos handles the cloud resources around the app so you can ship from source faster.',
  },
  {
    question: 'Is Sealos open source?',
    answer:
      'Yes. Sealos is open source, with the managed cloud built on the same Kubernetes-native foundation.',
  },
  {
    question: 'How is Sealos different from Vercel or Render?',
    answer:
      'Sealos gives you the convenience of a cloud app platform while keeping native Kubernetes compatibility for databases, apps, networking, and operations.',
  },
  {
    question: 'Can I migrate off Sealos later?',
    answer:
      'Yes. Workloads stay Kubernetes-compatible, so you can move them to another Kubernetes environment when your infrastructure needs change.',
  },
  {
    question: 'What about data residency / self-hosting?',
    answer:
      'You can use Sealos Cloud for managed regions or run the open-source platform in your own Kubernetes environment for stricter residency and control requirements.',
  },
];

export function FAQSection() {
  return (
    <section className="container mx-auto pt-16 pb-24 text-white lg:pt-20 lg:pb-28">
      <div className="flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl leading-tight font-semibold text-balance sm:text-4xl lg:text-5xl">
            <GradientText>Questions, answered.</GradientText>
          </h2>
          <p className="max-w-[618px] text-base leading-6 text-zinc-500">
            Start free for 7 days. Upgrade when you're ready. Cancel any time,
            no hostage data.
          </p>
        </div>

        <Accordion
          type="single"
          defaultValue="faq-0"
          collapsible
          className="w-full overflow-hidden rounded-xl border border-white/15 bg-white/[0.02]"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="border-white/15 transition-colors last:border-b-0 data-[state=open]:bg-white/[0.05]"
            >
              <AccordionTrigger className="px-6 py-7 text-left text-base font-normal text-white hover:no-underline sm:px-8 sm:text-xl [&>svg]:size-5 [&>svg]:text-zinc-500 [&[data-state=open]>svg]:text-blue-500">
                <span className="flex min-w-0 items-center gap-3">
                  <Lightbulb className="size-5 shrink-0 text-zinc-300" />
                  <span>{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-7 text-sm leading-6 text-zinc-500 sm:px-8">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
