import { notFound } from 'next/navigation';
import {
  platforms,
  getAllPlatformSlugs,
  comparePlatforms,
  hasPlatform,
  getPlatform,
} from '../config/platforms';
import { Metadata } from 'next';
import { TableSection } from './sections/TableSection';
import { HeroSection } from './sections/HeroSection';
import { ChoosePlatformSection } from './sections/ChoosePlatformSection';
import { FAQSection } from './sections/FAQSection';

interface ComparisonPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

/**
 * Parse slug to extract two platform keys
 * Slug format: "platform1-vs-platform2"
 */
function parseSlug(
  slug: string,
): [keyof typeof platforms, keyof typeof platforms] | null {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) {
    return null;
  }

  const [first, second] = parts;
  if (!hasPlatform(first) || !hasPlatform(second)) {
    return null;
  }

  // Ensure consistent ordering
  return comparePlatforms(first, second);
}

/**
 * Generate all possible comparison slugs
 */
export async function generateStaticParams() {
  const allSlugs = getAllPlatformSlugs();
  const params: Array<{ slug: string }> = [];

  // Generate all unique pairs
  for (let i = 0; i < allSlugs.length; i++) {
    for (let j = i + 1; j < allSlugs.length; j++) {
      const [first, second] = comparePlatforms(allSlugs[i], allSlugs[j]);
      const slug = `${first}-vs-${second}`;
      params.push({ slug });
    }
  }

  return params;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: ComparisonPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug, lang } = resolvedParams;

  const platformKeys = parseSlug(slug);
  if (!platformKeys) {
    return {
      title: 'Comparison Not Found',
    };
  }

  const [firstKey, secondKey] = platformKeys;
  const first = getPlatform(firstKey);
  const second = getPlatform(secondKey);

  const title = `${first.name} vs ${second.name} - Platform Comparison`;
  const description = `Compare ${first.name} and ${second.name} across developer experience, architecture, collaboration, and ecosystem.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

/**
 * Comparison detail page
 */
export default async function ComparisonDetailPage({
  params,
}: ComparisonPageProps) {
  const resolvedParams = await params;
  const { slug, lang } = resolvedParams;

  const platformKeys = parseSlug(slug);
  if (!platformKeys) {
    notFound();
  }

  const [firstKey, secondKey] = platformKeys;
  const firstPlatform = getPlatform(firstKey);
  const secondPlatform = getPlatform(secondKey);

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection
        firstPlatform={firstPlatform}
        secondPlatform={secondPlatform}
      />

      <TableSection
        firstPlatform={firstPlatform}
        secondPlatform={secondPlatform}
      />

      <ChoosePlatformSection
        firstPlatform={firstPlatform}
        secondPlatform={secondPlatform}
      />

      <FAQSection
        firstPlatform={firstPlatform}
        secondPlatform={secondPlatform}
      />
    </div>
  );
}
