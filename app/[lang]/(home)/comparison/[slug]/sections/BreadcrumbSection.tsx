import Link from 'next/link';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ComparisonConfig } from '../../config/platforms';

interface BreadcrumbSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
  lang?: string;
}

export function BreadcrumbSection({
  firstPlatform,
  secondPlatform,
  lang = 'en',
}: BreadcrumbSectionProps) {
  const homeHref = `/${lang}`;
  const comparisonHref = `/${lang}/comparison`;
  const currentPage = `${firstPlatform.name} vs. ${secondPlatform.name}`;

  return (
    <section className="container-compact pt-10 sm:pt-20">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={homeHref} className="flex items-center">
                <Home className="size-4" aria-label="Home page" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={comparisonHref}>Comparison</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </section>
  );
}
