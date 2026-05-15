'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useGTM } from '@/hooks/use-gtm';
import { getOpenBrainParam } from '@/lib/utils/brain';

export function TryFreeButton() {
  const handleAuthRedirect = useAuthRedirect();
  const { trackButton } = useGTM();

  return (
    <Button
      variant="landing-primary"
      className="w-full"
      onClick={() => {
        trackButton('Get Started', 'ai-quick-reference', 'auth-form', '');
        handleAuthRedirect({ openapp: getOpenBrainParam() });
      }}
    >
      <span>Try Free</span>
      <ArrowRight size={16} className="ml-1" />
    </Button>
  );
}
