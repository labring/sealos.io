import { GodRays } from '@/new-components/GodRays';
import { FAQPageClient } from './components/FAQPageClient';
import { GradientText } from '@/new-components/GradientText';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about Sealos',
    pathname: '/ai-quick-reference',
  });
}

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function AiFaqPage({ params }: PageProps) {
  const { lang } = await params;
  const langPrefix = `/${lang}`;

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
          aria-label="Frequently Asked Questions"
          className="mb-4 text-center text-4xl font-medium"
        >
          <span>Frequently Asked </span>
          <GradientText>Questions</GradientText>
        </h1>
        <p className="text-center text-zinc-400">
          Find answers to common questions about Sealos
        </p>

        <FAQPageClient langPrefix={langPrefix} />
      </section>
    </>
  );
}