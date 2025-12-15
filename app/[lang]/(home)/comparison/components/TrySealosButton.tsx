'use client';

import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';
import { getOpenBrainParam } from '@/lib/utils/brain';

export function TrySealosButton() {
  const openAuthForm = useOpenAuthForm();

  return (
    <Button
      variant="landing-primary"
      className="mt-10 h-10 w-fit gap-2"
      onClick={() => openAuthForm({ openapp: getOpenBrainParam() })}
    >
      <span>Try Sealos for free</span>
      <ArrowRightIcon size={16} />
    </Button>
  );
}

