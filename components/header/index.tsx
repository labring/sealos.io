'use client';

import { languagesType } from '@/lib/i18n';
import { Header as SharedHeader } from '@/new-components/Header';

type HeaderProps = {
  lang: languagesType;
};

export default function Header({ lang }: HeaderProps) {
  return (
    <div className="fixed top-0 z-50 w-full">
      <SharedHeader lang={lang} />
    </div>
  );
}
