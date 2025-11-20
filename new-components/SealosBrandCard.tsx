'use client';

import SealosLogoImage from '@/assets/shared-icons/sealos.svg';
import Image from 'next/image';
import { GradientText } from './GradientText';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';
import { getOpenBrainParam } from '@/lib/utils/brain';

export function SealosBrandCard() {
  const openAuthForm = useOpenAuthForm();

  return (
    <div className="border-border bg-primary-foreground w-full rounded-xl border p-8">
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex items-center gap-1">
          <Image
            alt="Sealos Logo"
            src={SealosLogoImage}
            className="mr-2 h-10 w-10"
            width={24}
            height={24}
          />
          <span className="text-2xl font-medium text-white">Sealos</span>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xl font-medium">
            <GradientText>Unify Your Entire Workflow.</GradientText>
          </p>
          <p className="text-muted-foreground text-sm">
            Code in a ready-to-use cloud environment, deploy with a click.
            Sealos combines the entire dev-to-prod lifecycle into one seamless
            platform. No more context switching.
          </p>
        </div>
      </div>

      <Button
        variant="landing-primary"
        className="w-full"
        onClick={() => openAuthForm({ openapp: getOpenBrainParam() })}
      >
        <span>Try Free</span>
        <ArrowRightIcon size={16} className="ml-1" />
      </Button>
    </div>
  );
}
