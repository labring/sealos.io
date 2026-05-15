'use client';

import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getOpenBrainParam } from '@/lib/utils/brain';

export function TrySealosButton() {
  const handleAuthRedirect = useAuthRedirect();

  return (
    <Button
      variant="landing-primary"
      className="mt-10 h-10 w-fit gap-2"
      onClick={() => handleAuthRedirect({ openapp: getOpenBrainParam() })}
    >
      <span>Try Sealos for free</span>
      <ArrowRightIcon size={16} />
    </Button>
  );
}
