import Link from 'next/link';
import { languagesType } from '@/lib/i18n';

interface BackNavigationProps {
  lang: languagesType;
  backText: string;
}

export default function BackNavigation({ lang, backText }: BackNavigationProps) {
  return (
    <Link
      href={`/${lang}/products/app-store`}
      className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <svg
        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span>{backText}</span>
    </Link>
  );
}
