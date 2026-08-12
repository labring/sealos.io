import { Check, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getRybbitCtaProps } from '@/lib/analytics/rybbit-cta';
import { CopyCommandButton } from './copy-command';
import {
  CODEX_INSTALL_COMMAND,
  FAQ_ITEMS,
  LICENSE_URL,
  PAGE_COPY,
  PREREQUISITES,
  REPO_URL,
} from './content';
import { WorkflowTabs } from './interactive-sections';
import {
  AnchorAlias,
  SectionHeading,
  SectionShell,
  TrackedLink,
} from './shared';

export function WorkflowSection() {
  return (
    <SectionShell id="pipeline" className="py-16 sm:py-24">
      <AnchorAlias id="use-cases" />
      <SectionHeading
        title={PAGE_COPY.workflow.title}
        description={PAGE_COPY.workflow.description}
      />
      <div className="mt-10">
        <WorkflowTabs />
      </div>
    </SectionShell>
  );
}

export function SetupFaqSection() {
  return (
    <SectionShell id="setup" className="py-16 sm:py-24">
      <AnchorAlias id="faq" />
      <SectionHeading
        eyebrow={PAGE_COPY.setup.eyebrow}
        title={PAGE_COPY.setup.title}
        description={PAGE_COPY.setup.description}
      />
      <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="border-t border-[#F5F2F8]/10">
          {PREREQUISITES.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-[36px_1fr] gap-4 border-b border-[#F5F2F8]/10 py-5"
            >
              <span className="flex size-9 items-center justify-center rounded-md border border-[#4CAFE1]/30 bg-[#4CAFE1]/10 text-[#4CAFE1]">
                <Check
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#F5F2F8]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#AAA4B4]">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Accordion
          type="single"
          collapsible
          className="border-t border-[#F5F2F8]/10"
        >
          {FAQ_ITEMS.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="border-[#F5F2F8]/10"
            >
              <AccordionTrigger className="gap-5 py-5 text-left text-base font-semibold text-[#F5F2F8] hover:no-underline focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none [&>svg]:text-[#7F798A] [&[data-state=open]>svg]:text-[#4CAFE1]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-[62ch] pb-5 text-sm leading-7 text-[#AAA4B4]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionShell>
  );
}

export function FinalCtaSection() {
  return (
    <SectionShell className="py-20 sm:py-28">
      <div className="border-t border-[#F5F2F8]/10 pt-20 text-center sm:pt-28">
        <h2
          className="mx-auto max-w-3xl text-[40px] leading-[46px] font-medium text-balance text-[#F5F2F8] sm:text-[52px] sm:leading-[58px]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {PAGE_COPY.final.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#AAA4B4] sm:text-lg">
          {PAGE_COPY.final.description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CopyCommandButton
            value={CODEX_INSTALL_COMMAND}
            label={PAGE_COPY.final.primaryCta}
            showStatus
            tone="accent"
            className="min-w-[148px]"
            tracking={{
              id: 'skills_final_copy_codex_install',
              location: 'sealos_skills_final',
              destination: 'clipboard_codex_install',
            }}
          />
          <TrackedLink
            href="#install"
            tracking={{
              id: 'skills_final_browse_install',
              location: 'sealos_skills_final',
              destination: 'sealos_skills_install',
            }}
          >
            {PAGE_COPY.final.secondaryCta}
            <ChevronDown
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </TrackedLink>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#AAA4B4] underline decoration-[#F5F2F8]/25 underline-offset-4 transition-colors hover:text-[#F5F2F8] focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none"
            {...getRybbitCtaProps({
              id: 'skills_repository_view_github',
              location: 'sealos_skills_final',
              destination: 'github_sealos_skills',
            })}
          >
            GitHub source
          </a>
          <a
            href={LICENSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#AAA4B4] underline decoration-[#F5F2F8]/25 underline-offset-4 transition-colors hover:text-[#F5F2F8] focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none"
          >
            MIT license
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
