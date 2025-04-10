'use client';

import { getHeaderLinks, navTranslations } from '@/app/layout.config';
import { appDomain, siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'fumadocs-core/link';
import { ExternalLink, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { GetStartedButton } from '../ui/shiny-button';
import { languagesType } from '@/lib/i18n';

export default function Header({ lang }: { lang: languagesType }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Get translated navigation links based on current language
  const localizedLinks = getHeaderLinks(lang);
  const translations = navTranslations[lang];

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHasScrolled(latest > 20);
  });

  return (
    <div
      className={cn(
        'fixed top-0 z-50 w-full',
        hasScrolled ? 'bg-[#EBF2FF] shadow-header' : '',
      )}
    >
      <nav className={cn('custom-container-header relative text-black')}>
        <div className={cn('flex w-full justify-between py-[10px]')}>
          <div className="flex items-center md:gap-x-9">
            <Link
              href={'/'}
              aria-label={siteConfig.name}
              title={siteConfig.name}
              className="flex items-center gap-2 font-bold"
            >
              <img
                alt="Sealos Logo"
                src="/logo.svg"
                className="h-8 w-8"
                width={48}
                height={48}
              />
              <span className="hidden text-xl font-bold md:block">
                {siteConfig.name}
              </span>
            </Link>
            <div className="hidden items-center gap-x-5 text-sm font-medium lg:flex">
              {localizedLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.url}
                  className="relative rounded-md px-2 py-1 hover:bg-[#0306070D]"
                >
                  {link.text}
                  {link.isExternal && (
                    <span className="pl-2">
                      <ExternalLink className="absolute right-0 top-0 size-3" />
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-4 text-sm font-medium lg:flex">
            <a href={appDomain} target="_blank">
              <GetStartedButton title={translations.getStarted} />
            </a>
          </div>

          {/* phone menu */}
          <div className={cn('lg:hidden', hasScrolled ? '' : ' ')}>
            <button
              aria-label="Open Menu"
              title="Open Menu"
              className="focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50 -mr-1 rounded p-2 transition duration-200 focus:outline-hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="fixed left-0 top-0 z-50 w-full">
                  <div className="bg-[#EBF2FF] px-4 py-3">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <Link
                          href="/"
                          aria-label={siteConfig.name}
                          title={siteConfig.name}
                          className="inline-flex items-center"
                        >
                          <img
                            alt="Sealos Logo"
                            src="/logo.svg"
                            className="h-8 w-8"
                            width={48}
                            height={48}
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
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <X />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-2">
                      {localizedLinks.map((link) => (
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
                      ))}
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
}
