'use client';

import { useGTM } from '@/hooks/use-gtm';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getOpenBrainParam } from '@/lib/utils/brain';

export function StartBuildingButton({ className }: { className?: string }) {
  const { trackButton } = useGTM();
  const handleAuthRedirect = useAuthRedirect();

  return (
    <Button
      variant="landing-primary"
      onClick={() => {
        trackButton('Get Started', 'footer', 'auth-form', '');
        handleAuthRedirect({ openapp: getOpenBrainParam() });
      }}
      className={className}
    >
      <span>Start Building for Free</span>
      <ArrowRight size={16} className="ml-1" />
    </Button>
  );
}
