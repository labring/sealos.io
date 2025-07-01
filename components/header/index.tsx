'use client';

import { getHeaderLinks, navTranslations } from '@/app/layout.config';
import { appDomain, siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'fumadocs-core/link';
import { ExternalLink, Menu, X } from 'lucide-react';
import { useState, useMemo, useCallback, memo } from 'react';
import { GetStartedButton } from '../ui/button-shiny';
import { languagesType } from '@/lib/i18n';
import DropdownMenu from './dropdown-menu';
import Image from 'next/image';

interface HeaderProps {
  lang: languagesType;
}

const Header = memo<HeaderProps>(({ lang }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Memoize translated navigation links to prevent recalculation
  const localizedLinks = useMemo(() => getHeaderLinks(lang), [lang]);
  const translations = useMemo(() => navTranslations[lang], [lang]);

  // Memoize event handlers
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHasScrolled(latest > 20);
  });

  return (
    <div
      className={cn(
        'fixed top-0 z-50 w-full',
        hasScrolled ? 'shadow-header bg-[#EBF2FF]' : '',
      )}
    >
      <nav className={cn('custom-container-header relative text-black')}>
        <div
          className={cn(
            'flex w-full min-w-0 items-center justify-between py-[10px]',
          )}
        >
          <div className="flex min-w-0 flex-shrink items-center md:gap-x-9">
            <Link
              href={'/'}
              aria-label={siteConfig.name}
              title={siteConfig.name}
              className="flex flex-shrink-0 items-center gap-2 font-bold"
            >
              <Image
                alt="Sealos Logo"
                src="/logo.svg"
                className="h-8 w-8"
                width={48}
                height={48}
                priority
              />
              <span className="hidden text-xl font-bold md:block">
                {siteConfig.name}
              </span>
            </Link>
            <div className="hidden items-center gap-x-5 text-sm font-medium lg:flex">
              {localizedLinks.map((link) =>
                link.children ? (
                  <DropdownMenu
                    key={link.text}
                    trigger={link.text}
                    items={link.children}
                  />
                ) : (
                  <Link
                    key={link.text}
                    href={link.url}
                    className="relative rounded-md px-2 py-1 hover:bg-[#0306070D]"
                  >
                    {link.text}
                    {link.isExternal && (
                      <span className="pl-2">
                        <ExternalLink className="absolute top-0 right-0 size-3" />
                      </span>
                    )}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="hidden items-center gap-4 text-sm font-medium lg:flex">
            <GetStartedButton
              title={translations.getStarted}
              link={appDomain}
              location="navbar"
            />
          </div>

          {/* phone menu */}
          <div className="flex flex-shrink-0 items-center lg:hidden">
            <button
              aria-label="Open Menu"
              title="Open Menu"
              className="focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50 rounded p-2 transition duration-200 focus:outline-hidden"
              onClick={handleMenuToggle}
            >
              <Menu />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
                  onClick={handleMenuClose}
                  aria-hidden="true"
                />
                <div className="fixed top-0 left-0 z-50 w-full">
                  <div className="bg-[#EBF2FF] px-4 py-3">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <Link
                          href="/"
                          aria-label={siteConfig.name}
                          title={siteConfig.name}
                          className="inline-flex items-center"
                        >
                          <Image
                            alt="Sealos Logo"
                            src="/logo.svg"
                            className="h-8 w-8"
                            width={48}
                            height={48}
                            priority
                          />
                          <span className="ml-2 text-xl font-bold tracking-wide text-gray-950">
                            {siteConfig.name}
                          </span>
                        </Link>
                      </div>
                      <div>
                        <button
                          aria-label="Close Menu"
                          title="Close Menu"
                          className="font-norma tracking-wide transition-colors duration-200"
                          onClick={handleMenuClose}
                        >
                          <X />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-2">
                      {localizedLinks.map((link) =>
                        link.children ? (
                          <div key={link.text} className="flex flex-col">
                            <div className="px-2 py-1 font-medium text-gray-900">
                              {link.text}
                            </div>
                            <div className="ml-4 flex flex-col gap-y-1">
                              {link.children.map((child) => (
                                <Link
                                  key={child.text}
                                  href={child.url}
                                  className="relative flex items-center rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-[#0306070D]"
                                >
                                  {child.text}
                                  {child.isExternal && (
                                    <span className="pl-2">
                                      <ExternalLink className="size-3" />
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            key={link.text}
                            href={link.url}
                            className="relative flex items-center rounded-md px-2 py-1 hover:bg-[#0306070D]"
                          >
                            {link.text}
                            {link.isExternal && (
                              <span className="pl-2">
                                <ExternalLink className="size-3" />
                              </span>
                            )}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
