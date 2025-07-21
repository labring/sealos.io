'use client';
import {
  SearchDialog,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { create } from '@orama/orama';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import { useCallback } from 'react';
import { useParams } from 'next/navigation';

export function DefaultSearchDialog(props: SharedProps) {
  const params = useParams<{ lang: string }>();

  const { search, setSearch, query } = useDocsSearch(
    {
      type: 'static',
      initOrama: useCallback(
        () =>
          create({
            schema: { _: 'string' },
            components: {
              tokenizer: createTokenizer(),
            },
          }),
        [],
      ),
    },
    // We filter tags for i18n search support for now.
    undefined,
    params.lang,
  );

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      results={query.data ?? []}
      {...props}
    />
  );
}
