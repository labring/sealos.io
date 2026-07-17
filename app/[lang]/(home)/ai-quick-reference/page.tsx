import { PageTopRays } from '@/new-components/SideRays';
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
      <PageTopRays />

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
