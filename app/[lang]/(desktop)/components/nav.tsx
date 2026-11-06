'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSearchContext } from 'fumadocs-ui/provider';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useGTM } from '@/hooks/use-gtm';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getRybbitCtaProps } from '@/lib/analytics/rybbit-cta';
import { getLanguageSlug, locales, type languagesType } from '@/lib/i18n';
import { getOpenBrainParam } from '@/lib/utils/brain';
import {
  getHeaderLinks,
  type HeaderNavLink,
} from '@/new-components/header-links';
import type { HomeCopy } from '../content';
import { portalContainer } from './portal';
import type { DesktopDownloadLinks } from '@/config/desktop-downloads';
import { NavDownloadButton } from './download';
import {
  ArrowUpRight,
  CheckIcon,
  ChevronDown,
  ChevronRight,
  GlobeIcon,
  MenuIcon,
  SealosMark,
  SearchIcon,
} from './icons';

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

function ResourcesMenu({ link }: { link: HeaderNavLink }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="sx-nav-link sx-nav-dropdown">
        <span>{link.text}</span>
        <ChevronDown className="sx-nav-dropdown-chevron" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal container={portalContainer()}>
        <DropdownMenu.Content className="sx-menu" align="start" sideOffset={8}>
          {link.children?.map((child) => (
            <DropdownMenu.Item key={child.id} asChild className="sx-menu-item">
              <a
                href={child.url}
                target={child.isExternal ? '_blank' : undefined}
                rel={child.isExternal ? 'noopener noreferrer' : undefined}
              >
                <span className="sx-menu-text">{child.text}</span>
                <span className="sx-menu-trailing">
                  {child.isExternal ? <ArrowUpRight /> : null}
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
  downloadLinks,
  lang,
}: {
  copy: HomeCopy;
  downloadLinks: DesktopDownloadLinks;
  lang: languagesType;
}) {
  const { setOpenSearch } = useSearchContext();
  const { trackButton } = useGTM();
  const handleAuthRedirect = useAuthRedirect();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const home = getLanguageSlug(lang) || '/';
  const links = getHeaderLinks({ lang });

  const signIn = (location: 'header' | 'header-mobile') => {
    trackButton('Sign In', location, 'auth-form', '');
    handleAuthRedirect({ openapp: getOpenBrainParam() });
  };

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
          {links.map((link) =>
            link.children ? (
              <ResourcesMenu key={link.id} link={link} />
            ) : (
              <a key={link.id} href={link.url} className="sx-nav-link">
                {link.text}
              </a>
            ),
          )}
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
          <button
            type="button"
            className="sx-nav-link"
            {...getRybbitCtaProps({
              id: 'home_header_sign_in',
              location: 'header',
              destination: 'signup_modal',
            })}
            onClick={() => signIn('header')}
          >
            {copy.nav.signIn}
          </button>
          <NavDownloadButton
            copy={copy.download}
            links={downloadLinks}
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
        {links.map((link) =>
          link.children ? (
            <div key={link.id} className="sx-mobile-group">
              <span className="sx-mobile-group-label">{link.text}</span>
              {link.children.map((child) => (
                <a
                  key={child.id}
                  href={child.url}
                  target={child.isExternal ? '_blank' : undefined}
                  rel={child.isExternal ? 'noopener noreferrer' : undefined}
                  className="sx-mobile-link sx-mobile-sublink"
                  onClick={() => setMenuOpen(false)}
                >
                  {child.text}
                </a>
              ))}
            </div>
          ) : (
            <a
              key={link.id}
              href={link.url}
              className="sx-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.text}
            </a>
          ),
        )}
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
        <button
          type="button"
          className="sx-btn sx-btn-secondary sx-btn-md sx-mobile-signin"
          {...getRybbitCtaProps({
            id: 'home_header_mobile_sign_in',
            location: 'header_mobile_menu',
            destination: 'signup_modal',
          })}
          onClick={() => {
            setMenuOpen(false);
            signIn('header-mobile');
          }}
        >
          {copy.nav.signIn}
        </button>
        <NavDownloadButton
          copy={copy.download}
          links={downloadLinks}
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
