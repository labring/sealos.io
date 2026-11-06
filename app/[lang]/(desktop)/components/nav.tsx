'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSearchContext } from 'fumadocs-ui/provider';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getLanguageSlug, locales, type languagesType } from '@/lib/i18n';
import type { HomeCopy } from '../content';
import { portalContainer } from './portal';
import { NavDownloadButton } from './download';
import {
  CheckIcon,
  ChevronRight,
  GlobeIcon,
  MenuIcon,
  SealosMark,
  SearchIcon,
} from './icons';
import { ThemeToggle } from './theme';

export function LanguageMenu({
  lang,
  label,
}: {
  lang: languagesType;
  label: string;
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="sx-btn sx-btn-secondary sx-btn-md sx-lang">
        <GlobeIcon />
        <span>{label}</span>
        <ChevronRight className="sx-btn-chevron" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal container={portalContainer()}>
        <DropdownMenu.Content className="sx-menu" align="end" sideOffset={8}>
          {locales.map((locale) => (
            <DropdownMenu.Item
              key={locale.locale}
              asChild
              className="sx-menu-item"
            >
              <a
                href={getLanguageSlug(locale.locale) || '/'}
                hrefLang={locale.locale}
              >
                <span className="sx-menu-text">{locale.name}</span>
                <span className="sx-menu-trailing">
                  {locale.locale === lang ? <CheckIcon /> : null}
                </span>
              </a>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function HomeNav({
  copy,
  lang,
}: {
  copy: HomeCopy;
  lang: languagesType;
}) {
  const { setOpenSearch } = useSearchContext();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const home = getLanguageSlug(lang) || '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className="sx-nav"
      data-scrolled={scrolled || undefined}
      data-open={menuOpen || undefined}
    >
      <div className="sx-nav-inner">
        <Link href={home} className="sx-brand" aria-label="Sealos">
          <SealosMark className="sx-brand-mark" />
          <span>Sealos</span>
        </Link>

        <nav className="sx-nav-links" aria-label="Primary">
          {copy.nav.links.map((link) => (
            <a key={link.href} href={link.href} className="sx-nav-link">
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className="sx-nav-link sx-nav-search"
            aria-label={copy.nav.search}
            title={copy.nav.search}
            onClick={() => setOpenSearch(true)}
          >
            <SearchIcon />
          </button>
        </nav>

        <div className="sx-nav-actions">
          <LanguageMenu lang={lang} label={copy.nav.language} />
          <ThemeToggle labels={copy.nav.theme} />
          <NavDownloadButton
            copy={copy.download}
            tracking={{
              id: 'home_header_download',
              location: 'header',
              destination: 'desktop_download',
            }}
          />
        </div>

        <button
          type="button"
          className="sx-nav-menu-button"
          aria-expanded={menuOpen}
          aria-controls="sx-mobile-menu"
          aria-label={copy.nav.menu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon />
        </button>
      </div>

      <div id="sx-mobile-menu" className="sx-mobile-menu" hidden={!menuOpen}>
        {copy.nav.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="sx-mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <button
          type="button"
          className="sx-mobile-link"
          onClick={() => {
            setMenuOpen(false);
            setOpenSearch(true);
          }}
        >
          {copy.nav.search}
        </button>
        <div className="sx-mobile-row">
          <LanguageMenu lang={lang} label={copy.nav.language} />
          <ThemeToggle labels={copy.nav.theme} />
        </div>
        <NavDownloadButton
          copy={copy.download}
          tracking={{
            id: 'home_header_mobile_download',
            location: 'header_mobile',
            destination: 'desktop_download',
          }}
        />
      </div>
    </header>
  );
}
