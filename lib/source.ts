import {
  docs,
  meta,
  blog as blogPosts,
  tutorials as tutorialPosts,
  aiQuickReference,
} from '@/.source';
import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { i18n } from '@/lib/i18n';

function createSource(docs: unknown[], meta: unknown[] = []) {
  const source = createMDXSource(docs as never[], meta as never[]) as {
    files: unknown[] | (() => unknown[]);
  };

  return {
    ...source,
    files: typeof source.files === 'function' ? source.files() : source.files,
  } as ReturnType<typeof createMDXSource>;
}

export const source = loader({
  i18n,
  baseUrl: '/docs',
  icon(icon) {
    if (!icon) {
      // You may set a default icon
      return;
    }

    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
  source: createSource(docs, meta),
});

export const blog = loader({
  i18n,
  baseUrl: '/blog',
  source: createSource(blogPosts, []),
});


export const tutorials = loader({
  i18n,
  baseUrl: '/tutorials',
  source: createMDXSource(tutorialPosts, []),
});

export const faqSource = loader({
  i18n,
  baseUrl: '/ai-quick-reference',
  source: createSource(aiQuickReference, []),
});
