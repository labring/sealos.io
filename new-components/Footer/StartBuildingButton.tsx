'use client';

import Link from 'fumadocs-core/link';
import { useMemo } from 'react';
import { useGTM } from '@/hooks/use-gtm';
import { getBrainUrl } from '@/lib/utils/brain';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function StartBuildingButton() {
  const { trackButton } = useGTM();
  const targetUrl = useMemo(() => getBrainUrl(), []);

  return (
    <Button variant="landing-primary" asChild>
      <Link
        href={targetUrl}
        onClick={() => trackButton('Get Started', 'footer', 'url', targetUrl)}
      >
        <span>Start Building for Free</span>
        <ArrowRight size={16} className="ml-1" />
      </Link>
    </Button>
  );
}
