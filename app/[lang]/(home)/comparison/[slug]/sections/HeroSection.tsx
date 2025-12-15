'use client';

import { GradientText } from '@/new-components/GradientText';
import { ComparisonConfig } from '../../config/platforms';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { ComparisonHeaderSVG } from './ComparisonHeaderSVG';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';
import { getOpenBrainParam } from '@/lib/utils/brain';

interface HeroSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function HeroSection({
  firstPlatform,
  secondPlatform,
}: HeroSectionProps) {
  const openAuthForm = useOpenAuthForm();

  return (
    <section className="container mx-auto flex flex-col justify-center px-4 pb-28">
      <ComparisonHeaderSVG
        firstPlatform={firstPlatform}
        secondPlatform={secondPlatform}
      />
      <h1 className="mb-6 text-center text-4xl font-medium">
        <GradientText>
          {firstPlatform.name} vs. {secondPlatform.name}
        </GradientText>
      </h1>
      <p className="text-muted-foreground mx-auto max-w-3xl text-center">
        As AI technology advances, choosing the right platform is crucial for
        your team's speed, governance, and long-term success. Both{' '}
        {firstPlatform.name} and {secondPlatform.name} have their strengths. The
        sections below compare them across developer experience, scalability,
        and total cost of ownership.
      </p>

      <Button
        variant="landing-primary"
        className="mx-auto mt-10 h-10 gap-2"
        onClick={() => openAuthForm({ openapp: getOpenBrainParam() })}
      >
        Try Sealos for free
        <ArrowRightIcon size={16} />
      </Button>

      <p className="text-muted-foreground mx-auto mt-10 border-t pt-16 text-sm sm:mt-20">
        As AI technologies evolve, delivering and scaling applications has
        become essential for powering modern businesses, from AI startups to
        large-scale enterprises. There are various solutions available,
        including comprehensive cloud operating systems, managed
        Platform-as-a-Service (PaaS), and traditional IaaS. Selecting the right
        platform is crucial for your team's velocity, governance, and long-term
        success.
      </p>

      <p className="text-muted-foreground mx-auto mt-10 text-sm">
        {firstPlatform.name} and {secondPlatform.name} both bring unique
        strengths to application delivery, each with its own capabilities and
        limitations. The best choice depends on your specific use case and
        requirements. In the following sections, we'll compare both platforms
        regarding developer experience, scalability, and total cost of
        ownership, helping you determine the most suitable option for your
        needs—even if it's not us.
      </p>
    </section>
  );
}
