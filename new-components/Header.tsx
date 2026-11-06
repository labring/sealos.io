'use client';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  ChevronDown,
  Menu,
  X,
  BookOpenText,
  GraduationCap,
  FileText,
  Github,
  Users,
} from 'lucide-react';
import {
  useScroll,
  motion,
  useMotionValueEvent,
  AnimatePresence,
} from 'motion/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';
import { useGTM } from '@/hooks/use-gtm';
import { siteConfig } from '@/config/site';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getOpenBrainParam } from '@/lib/utils/brain';
import { getLanguageSlug, type languagesType } from '@/lib/i18n';
import { getRybbitCtaProps } from '@/lib/analytics/rybbit-cta';
import {
  getHeaderLinks,
  type HeaderLinkId,
  type HeaderNavChild,
  type HeaderNavLink,
} from '@/new-components/header-links';

type NavigationChild = HeaderNavChild & {
  icon?: React.ReactNode;
};

type NavigationLink = Omit<HeaderNavLink, 'children'> & {
  children?: NavigationChild[];
  dropdownConfig?: {
    className?: string;
  };
};

type HeaderProps = {
  lang?: languagesType;
};

// Link set comes from header-links.ts; this header adds icons and panel sizing.
const navigationIcons: Partial<Record<HeaderLinkId, React.ReactNode>> = {
  learn: <BookOpenText size={16} />,
  tutorials: <GraduationCap size={16} />,
  blog: <FileText size={16} />,
  community: <Users size={16} />,
};

const dropdownConfigs: Partial<
  Record<HeaderLinkId, NavigationLink['dropdownConfig']>
> = {
  resources: {
    className: 'w-[40rem]! md:w-[40rem]!',
  },
};

const DropdownMenuItem = ({ child }: { child: NavigationChild }) => {
  return (
    <NavigationMenuLink asChild>
      <a
        href={child.url}
        target={child.isExternal ? '_blank' : undefined}
        rel={child.isExternal ? 'noopener noreferrer' : undefined}
        className="group relative flex flex-col justify-center rounded-xl border border-transparent px-2 py-2.5 transition-all hover:bg-white/10 focus:bg-white/10 focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {child.icon && (
            <div className="flex flex-shrink-0 items-center justify-center rounded-lg bg-white/5 p-2">
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
  config,
}: {
  title: string;
  children: NavigationChild[];
  config?: {
    className?: string;
  };
}) => {
  return (
    <>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>

      <NavigationMenuContent className="relative !border-none !bg-transparent !shadow-none">
        <div
          className={cn(
            'inset-shadow-bubble rounded-xl bg-neutral-950 p-4 backdrop-blur-xl',
            config?.className,
          )}
        >
          <div className="text-muted-foreground text-sm">{title}</div>
          <div className="grid grid-cols-2 gap-3">
            {children.map((child, index) => (
              <DropdownMenuItem key={index} child={child} />
            ))}
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

  const { scrollY } = useScroll();
  const [hideLogotype, setHideLogotype] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  useMotionValueEvent(scrollY, 'change', (current) => {
    if (current > 0 && scrollY.getPrevious() !== 0) {
      setHideLogotype(true);
    } else {
      setHideLogotype(false);
    }
  });

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

  React.useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const bodyOverflow = document.body.style.overflow;
    const documentOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = documentOverflow;
    };
  }, [isMobileMenuOpen]);

  const localizedNavigationLinks = React.useMemo<NavigationLink[]>(
    () =>
      getHeaderLinks({ lang: resolvedLang, textLang: 'en' }).map((link) => ({
        ...link,
        dropdownConfig: dropdownConfigs[link.id],
        children: link.children?.map((child) => ({
          ...child,
          icon: navigationIcons[child.id],
        })),
      })),
    [resolvedLang],
  );

  const homeHref = resolvedLang ? `${getLanguageSlug(resolvedLang)}/` : '/';

  return (
    <>
      <div className="container pt-8">
        <nav className="inset-shadow-bubble flex w-full justify-between rounded-full bg-white/5 px-6 py-3 backdrop-blur-lg">
          <div className="flex">
            <a
              href={homeHref}
              className="mr-4 flex items-center justify-center"
              aria-label="Sealos Logotype"
              role="banner"
            >
              <Image
                alt="Sealos Logo"
                src="/logo.svg"
                className="h-8 w-8"
                width={36}
                height={36}
                priority
              />
              <motion.div
                initial={{ width: 'auto', opacity: 1 }}
                animate={{
                  width: hideLogotype ? 0 : 'auto',
                  opacity: hideLogotype ? 0 : 1,
                }}
                transition={{
                  duration: 0.2,
                  ease: [0, 0, 0.2, 1],
                }}
                className="overflow-hidden"
              >
                <span className="pl-1 leading-none font-bold whitespace-nowrap">
                  Sealos
                </span>
              </motion.div>
            </a>

            <NavigationMenu
              className="hidden lg:flex"
              viewport={false}
              role="navigation"
            >
              <NavigationMenuList>
                {localizedNavigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    {link.children ? (
                      <DropdownMenu
                        title={link.text}
                        children={link.children}
                        config={link.dropdownConfig}
                      />
                    ) : (
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <a
                          href={link.url}
                          target={link.isExternal ? '_blank' : undefined}
                          rel={
                            link.isExternal ? 'noopener noreferrer' : undefined
                          }
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

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="hidden h-10 rounded-full lg:flex"
              aria-label="Open Sealos GitHub page."
            >
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
                onClick={() =>
                  trackButton(
                    'GitHub',
                    'header',
                    'url',
                    siteConfig.links.github,
                  )
                }
              >
                <Github size={16} aria-hidden="true" />
                <span>18.3k</span>
              </a>
            </Button>
            <Button
              variant="landing-primary"
              className="hidden h-10 lg:flex"
              aria-label="Start using Sealos for free."
              {...getRybbitCtaProps({
                id: 'home_header_get_started',
                location: 'header',
                destination: 'signup_modal',
              })}
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
              className="h-10 w-10 lg:hidden"
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
                        <Github size={16} aria-hidden="true" />
                        <span>18.3k</span>
                      </a>
                    </Button>
                    <Button
                      variant="landing-primary"
                      className="h-12 w-full border border-white text-base"
                      aria-label="Start using Sealos for free."
                      {...getRybbitCtaProps({
                        id: 'home_header_mobile_get_started',
                        location: 'header_mobile_menu',
                        destination: 'signup_modal',
                      })}
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
