import { Button } from '@/components/ui/button';
import { GodRays } from '@/new-components/GodRays';
import { GradientText } from '@/new-components/GradientText';
import { RssIcon } from 'lucide-react';

export default function BlogPage() {
  return (
    <>
      <GodRays
        sources={[
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 20,
            count: 12,
            color: '220, 220, 220',
            opacityMin: 0.24,
            opacityMax: 0.25,
            minWidth: 120,
            maxWidth: 180,
          },
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 8,
            count: 6,
            color: '255, 255, 255',
            opacityMin: 0.89,
            opacityMax: 0.9,
            minWidth: 12,
            maxWidth: 24,
          },
          {
            x: 0.25,
            y: -0.06,
            angle: 50,
            spread: 20,
            count: 6,
            color: '180, 180, 180',
            opacityMin: 0.14,
            opacityMax: 0.15,
            minWidth: 60,
            maxWidth: 120,
          },
        ]}
        speed={0.0}
        maxWidth={48}
        minLength={1200}
        maxLength={2000}
        blur={8}
      />

      <section className="container -mt-24 pt-44 pb-14">
        <h1
          aria-label="Sealos Blog"
          className="mb-4 text-center text-4xl font-medium"
        >
          <span>Sealos </span>
          <GradientText>Blog</GradientText>
        </h1>
        <p className="text-center text-zinc-400">
          Sharing our technical insights, product updates and industry news
        </p>

        <div className="mt-10 flex w-full justify-center">
          <Button variant="landing-primary" className="h-10">
            <RssIcon size={16} className="mr-2" />
            <span>Subscribe</span>
          </Button>
        </div>
      </section>
    </>
  );
}
