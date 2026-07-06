'use client';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  ChevronDown,
  CodeXmlIcon,
  DatabaseIcon,
  LayoutGridIcon,
  Menu,
  X,
  School,
  Gamepad2,
  Building2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';
import GitHubIcon from '@/assets/github.svg';
import { useGTM } from '@/hooks/use-gtm';
import { siteConfig } from '@/config/site';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getOpenBrainParam } from '@/lib/utils/brain';
import { i18n, languagesType } from '@/lib/i18n';

type NavigationChild = {
  text: string;
  url: string;
  isExternal: boolean;
  description?: string;
  icon?: React.ReactNode;
};

type NavigationLink = {
  text: string;
  url: string;
  isExternal: boolean;
  children?: NavigationChild[];
};

type HeaderProps = {
  lang?: languagesType;
};

const navigationLinks: NavigationLink[] = [
  {
    text: 'Products',
    url: '#',
    isExternal: false,
    children: [
      {
        text: 'DevBox',
        url: '/products/devbox',
        isExternal: false,
        description: 'Cloud development environment',
        icon: <CodeXmlIcon size={16} />,
      },
      {
        text: 'App Store',
        url: '/products/app-store',
        isExternal: false,
        description: 'Run your favorite apps',
        icon: <LayoutGridIcon size={16} />,
      },
      {
        text: 'Databases',
        url: '/products/databases',
        isExternal: false,
        description: '1-click managed DB',
        icon: <DatabaseIcon size={16} />,
      },
    ],
  },
  {
    text: 'Docs',
    url: '/docs',
    isExternal: false,
  },
  {
    text: 'Blog',
    url: '/blog',
    isExternal: false,
  },
  {
    text: 'Pricing',
    url: '/pricing',
    isExternal: false,
  },
  {
    text: 'Solutions',
    url: '#',
    isExternal: false,
    children: [
      {
        text: 'Education',
        url: '/solutions/industries/education',
        isExternal: false,
        description: 'Empower learning with cloud infrastructure',
        icon: <School size={16} />,
      },
      {
        text: 'Gaming',
        url: '/solutions/industries/gaming',
        isExternal: false,
        description: 'Scale your gaming platform',
        icon: <Gamepad2 size={16} />,
      },
      {
        text: 'Information Technology',
        url: '/solutions/industries/information-technology',
        isExternal: false,
        description: 'Enterprise-grade IT solutions',
        icon: <Building2 size={16} />,
      },
    ],
  },
  {
    text: 'Contact',
    url: '/contact',
    isExternal: false,
  },
];

const DropdownMenuItem = ({ child }: { child: NavigationChild }) => {
  return (
    <NavigationMenuLink asChild>
      <a
        href={child.url}
        target={child.isExternal ? '_blank' : undefined}
        rel={child.isExternal ? 'noopener noreferrer' : undefined}
        className="group relative flex flex-col justify-center rounded-xl border border-transparent px-2 py-2.5 text-white transition-all hover:bg-white/10 focus:bg-white/10 focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {child.icon && (
            <div className="flex flex-shrink-0 items-center justify-center rounded-lg bg-white/10 p-2 text-white/80">
              {child.icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-base text-white group-hover:text-white">
              {child.text}
            </div>
            {child.description && (
              <div className="text-sm text-white/60">{child.description}</div>
            )}
          </div>
        </div>
      </a>
    </NavigationMenuLink>
  );
};

const DropdownMenu = ({
  title,
  children,
}: {
  title: string;
  children: NavigationChild[];
}) => {
  return (
    <>
      <NavigationMenuTrigger className="h-8 gap-0.5 rounded-md px-2 py-1 text-base font-normal text-white hover:bg-white/10 focus:bg-white/10 data-[state=open]:bg-white/10">
        {title}
      </NavigationMenuTrigger>

      <NavigationMenuContent className="relative !border-none !bg-transparent !shadow-none">
        <div className="inset-shadow-bubble w-screen max-w-2xl rounded-2xl border border-white/10 bg-neutral-950/95 p-4 text-white shadow-2xl backdrop-blur-xl">
          <div className="mb-2 text-sm text-white/50">{title}</div>
          <div className="grid grid-cols-2 gap-3">
            {children.slice(0, 2).map((child, index) => (
              <DropdownMenuItem key={index} child={child} />
            ))}
            {children.length > 2 && (
              <div className="col-span-1 row-start-2">
                <DropdownMenuItem child={children[2]} />
              </div>
            )}
          </div>
        </div>
      </NavigationMenuContent>
    </>
  );
};

export function Header({ lang }: HeaderProps) {
  const { trackButton } = useGTM();
  const handleAuthRedirect = useAuthRedirect();
  const params = useParams();
  const paramLang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;
  const resolvedLang = lang ?? (paramLang as languagesType | undefined);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMenus({});
  };

  const toggleSubmenu = (menuText: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuText]: !prev[menuText],
    }));
  };

  const localizedNavigationLinks = React.useMemo(() => {
    if (!resolvedLang || resolvedLang === i18n.defaultLanguage) {
      return navigationLinks;
    }

    const localizeUrl = (url: string, isExternal: boolean) => {
      if (isExternal || url.startsWith('#')) {
        return url;
      }
      if (url.startsWith(`/${resolvedLang}`)) {
        return url;
      }
      if (url === '/') {
        return `/${resolvedLang}`;
      }
      if (url.startsWith('/')) {
        return `/${resolvedLang}${url}`;
      }
      return `/${resolvedLang}/${url}`;
    };

    return navigationLinks.map((link) => ({
      ...link,
      url: localizeUrl(link.url, link.isExternal),
      children: link.children?.map((child) => ({
        ...child,
        url: localizeUrl(child.url, child.isExternal),
      })),
    }));
  }, [resolvedLang]);

  const homeHref = resolvedLang ? `/${resolvedLang}` : '/';

  return (
    <>
      <div className="w-full px-2 text-white lg:bg-black/20 lg:backdrop-blur-xl">
        <nav className="container mx-auto flex min-h-16 items-center justify-between rounded-full bg-white/10 px-4 py-3 shadow-lg backdrop-blur-3xl lg:h-24 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-2 lg:shadow-none lg:backdrop-blur-none">
          <div className="flex min-w-0 items-center gap-9">
            <a
              href={homeHref}
              className="flex min-w-0 items-center gap-1"
              aria-label="Sealos Logotype"
              role="banner"
            >
              <Image
                alt="Sealos Logo"
                src="/logo.svg"
                className="h-6 w-6 rounded-full"
                width={24}
                height={24}
                priority
              />
              <span className="leading-none font-bold whitespace-nowrap">
                Sealos
              </span>
            </a>

            <NavigationMenu
              className="hidden lg:flex"
              viewport={false}
              role="navigation"
            >
              <NavigationMenuList className="gap-4">
                {localizedNavigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    {link.children ? (
                      <DropdownMenu
                        title={link.text}
                        children={link.children}
                      />
                    ) : (
                      <NavigationMenuLink asChild>
                        <a
                          href={link.url}
                          target={link.isExternal ? '_blank' : undefined}
                          rel={
                            link.isExternal ? 'noopener noreferrer' : undefined
                          }
                          className="inline-flex h-8 items-center justify-center rounded-md px-2 py-1 text-base font-normal text-white transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                        >
                          {link.text}
                        </a>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-4 lg:flex">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                aria-label="Open Sealos GitHub page."
                onClick={() =>
                  trackButton(
                    'GitHub',
                    'header',
                    'url',
                    siteConfig.links.github,
                  )
                }
              >
                <Image src={GitHubIcon} alt="" width={16} height={16} />
                <span>16.4k</span>
              </a>
              <div className="h-4 w-px bg-white/30" aria-hidden="true" />
            </div>
            <Button
              variant="landing-primary"
              className="hidden h-10 rounded-full px-4 py-2 text-sm font-medium shadow-lg lg:flex"
              aria-label="Start using Sealos for free."
              onClick={() => {
                trackButton('Get Started', 'header', 'auth-form', '');
                handleAuthRedirect({ openapp: getOpenBrainParam() });
              }}
            >
              Get Started For Free
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-white hover:bg-white/10 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg lg:hidden"
            onClick={closeMobileMenu}
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              exit={{ height: 0 }}
              transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
              className="w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="scrollbar-hide h-screen overflow-y-auto bg-neutral-950 text-white">
                <div className="container mx-auto px-4 py-6 sm:px-6">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-2" role="banner">
                      <Image
                        alt="Sealos Logo"
                        src="/logo.svg"
                        className="h-6 w-6"
                        width={24}
                        height={24}
                        priority
                      />
                      <span className="font-bold text-white">Sealos</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeMobileMenu}
                      className="rounded-full text-white hover:bg-white/10"
                      aria-label="Close navigation menu"
                    >
                      <X size={24} />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2" role="navigation">
                    {localizedNavigationLinks.map((link, index) => (
                      <div key={index} className="border-b border-white/10">
                        {link.children ? (
                          <>
                            <button
                              onClick={() => toggleSubmenu(link.text)}
                              className="flex w-full items-center justify-between py-4 text-lg font-medium text-white transition-colors hover:text-white/80"
                            >
                              <span>{link.text}</span>
                              <motion.div
                                animate={{
                                  rotate: openMenus[link.text] ? 180 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown size={20} />
                              </motion.div>
                            </button>
                            <AnimatePresence>
                              {openMenus[link.text] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-3 pb-4 pl-4">
                                    {link.children.map((child, childIndex) => (
                                      <a
                                        key={childIndex}
                                        href={child.url}
                                        onClick={closeMobileMenu}
                                        target={
                                          child.isExternal
                                            ? '_blank'
                                            : undefined
                                        }
                                        rel={
                                          child.isExternal
                                            ? 'noopener noreferrer'
                                            : undefined
                                        }
                                        className="flex flex-col gap-1 rounded-lg bg-white/5 p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                                      >
                                        <div className="flex items-center gap-2">
                                          {child.icon && (
                                            <div className="flex-shrink-0">
                                              {child.icon}
                                            </div>
                                          )}
                                          <span className="font-medium">
                                            {child.text}
                                          </span>
                                        </div>
                                        {child.description && (
                                          <span className="pl-0 text-sm text-white/50">
                                            {child.description}
                                          </span>
                                        )}
                                      </a>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <a
                            href={link.url}
                            onClick={closeMobileMenu}
                            target={link.isExternal ? '_blank' : undefined}
                            rel={
                              link.isExternal
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            className="block py-4 text-lg font-medium text-white transition-colors hover:text-white/80"
                          >
                            {link.text}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-3">
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 w-full rounded-full border-white/20 text-base text-white hover:bg-white/10"
                      aria-label="Open Sealos GitHub page."
                    >
                      <a
                        href="https://github.com/labring/sealos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-2"
                        onClick={closeMobileMenu}
                      >
                        <Image
                          src={GitHubIcon}
                          alt="GitHub"
                          width={16}
                          height={16}
                        />
                        <span>16.4k</span>
                      </a>
                    </Button>
                    <Button
                      variant="landing-primary"
                      className="h-12 w-full border border-white text-base"
                      aria-label="Start using Sealos for free."
                      onClick={() => {
                        trackButton(
                          'Get Started',
                          'header-mobile',
                          'auth-form',
                          '',
                        );
                        handleAuthRedirect({ openapp: getOpenBrainParam() });
                        closeMobileMenu();
                      }}
                    >
                      Get Start For Free
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
