'use client';

import { useGTM } from '@/hooks/use-gtm';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getOpenBrainParam } from '@/lib/utils/brain';
import { getRybbitCtaProps } from '@/lib/analytics/rybbit-cta';

export function StartBuildingButton({ className }: { className?: string }) {
  const { trackButton } = useGTM();
  const handleAuthRedirect = useAuthRedirect();

  return (
    <Button
      variant="landing-primary"
      {...getRybbitCtaProps({
        id: 'home_footer_start_building',
        location: 'footer_cta',
        destination: 'signup_modal',
      })}
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
