'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';

const LazyDocsSearchDialog = dynamic(
  () =>
    import('./Search').then(
      (mod) => mod.DefaultSearchDialog as ComponentType<SharedProps>,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

export function LazySearchDialog(props: SharedProps) {
  return <LazyDocsSearchDialog {...props} />;
}
