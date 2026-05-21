'use client';

import { useState } from 'react';
import { appsConfig } from '@/config/apps';
import { languagesType } from '@/lib/i18n';
import AppGrid from '@/components/app-store/app-grid';
import AppStoreHero from './app-store-hero';
import CategoryShowcase from './category-showcase';

interface AppStoreContentProps {
  lang: languagesType;
}

export default function AppStoreContent({ lang }: AppStoreContentProps) {
  const [query, setQuery] = useState('');

  return (
    <>
      <div className="-mt-24 overflow-x-clip">
        <AppStoreHero
          apps={appsConfig}
          query={query}
          onQueryChange={setQuery}
        />
      </div>
      <CategoryShowcase apps={appsConfig} />
      <AppGrid
        lang={lang}
        initialApps={appsConfig}
        query={query}
        onQueryChange={setQuery}
      />
    </>
  );
}
