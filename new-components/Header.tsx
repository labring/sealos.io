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
  CodeXmlIcon,
  DatabaseIcon,
  LayoutGridIcon,
  Menu,
  X,
} from 'lucide-react';
import {
  useScroll,
  motion,
  useMotionValueEvent,
  AnimatePresence,
} from 'motion/react';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';
import GitHubIcon from '@/assets/github.svg';
import { useGTM } from '@/hooks/use-gtm';
import { siteConfig } from '@/config/site';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';
import { getOpenBrainParam } from '@/lib/utils/brain';

// 导航链接数据类型
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
  dropdownConfig?: {
    className?: string;
  };
};

// 导航链接数据
const navigationLinks: NavigationLink[] = [
  {
    text: 'Products',
    url: '#',
    isExternal: false,
    dropdownConfig: {
      className: 'w-[40rem]! md:w-[40rem]!',
    },
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
    dropdownConfig: {
      className: 'w-[40rem]! md:w-[40rem]!',
    },
    children: [
      {
        text: 'Education',
        url: '/solutions/industries/education',
        isExternal: false,
        description: 'Empower learning with cloud infrastructure',
      },
      {
        text: 'Gaming',
        url: '/solutions/industries/gaming',
        isExternal: false,
        description: 'Scale your gaming platform',
      },
      {
        text: 'Information Technology',
        url: '/solutions/industries/information-technology',
        isExternal: false,
        description: 'Enterprise-grade IT solutions',
      },
    ],
  },
  {
    text: 'Contact',
    url: '/contact',
    isExternal: false,
  },
];

const DropdownMenuItem = ({
  child,
  onClose,
}: {
  child: NavigationChild;
  onClose?: () => void;
}) => {
  return (
    <NavigationMenuLink asChild>
      <a
        href={child.url}
        onClick={onClose}
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
    width?: string;
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

export function Header() {
  const { trackButton } = useGTM();
  const openAuthForm = useOpenAuthForm();

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

  // 关闭移动端菜单
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMenus({});
  };

  // 切换子菜单
  const toggleSubmenu = (menuText: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuText]: !prev[menuText],
    }));
  };

  return (
    <>
      <nav className="inset-shadow-bubble flex w-full justify-between rounded-full bg-white/5 px-6 py-3 backdrop-blur-lg">
        {/* Left */}
        <div className="flex">
          <a
            href="/"
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

          {/* Desktop Navigation */}
          <NavigationMenu
            className="hidden lg:flex"
            viewport={false}
            role="navigation"
          >
            <NavigationMenuList>
              {navigationLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  {link.children ? (
                    link.dropdownConfig ? (
                      <DropdownMenu
                        title={link.text}
                        children={link.children}
                        config={link.dropdownConfig}
                      />
                    ) : (
                      <>
                        <NavigationMenuTrigger>
                          {link.text}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="rounded-lg border border-white/10 bg-black p-2 shadow-md">
                          <ul
                            className="w-full min-w-[12rem]"
                            aria-hidden="true"
                          >
                            {link.children.map((child, childIndex) => (
                              <li key={childIndex} aria-hidden="true">
                                <DropdownMenuItem child={child} />
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    )
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

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Desktop Buttons */}
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
                trackButton('GitHub', 'header', 'url', siteConfig.links.github)
              }
            >
              <Image src={GitHubIcon} alt="GitHub" width={16} height={16} />
              <span>16.4k</span>
            </a>
          </Button>
          <Button
            variant="landing-primary"
            className="hidden h-10 lg:flex"
            aria-label="Start using Sealos for free."
            onClick={() => {
              trackButton('Get Started', 'header', 'auth-form', '');
              openAuthForm({ openapp: getOpenBrainParam() });
            }}
          >
            Get Started Free
          </Button>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay - 全屏遮罩 */}
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
              <div className="h-screen overflow-y-auto bg-gradient-to-br from-gray-900 to-black p-6">
                {/* Mobile Menu Header */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-2" role="banner">
                    <Image
                      alt="Sealos Logo"
                      src="/logo.svg"
                      className="h-8 w-8"
                      width={36}
                      height={36}
                      priority
                    />
                    <span className="text-xl font-bold text-white">Sealos</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMobileMenu}
                    className="text-white"
                    aria-label="Close navigation menu"
                  >
                    <X size={24} />
                  </Button>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex flex-col gap-2" role="navigation">
                  {navigationLinks.map((link, index) => (
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
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 7.5L10 12.5L15 7.5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
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
                                        child.isExternal ? '_blank' : undefined
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
                            link.isExternal ? 'noopener noreferrer' : undefined
                          }
                          className="block py-4 text-lg font-medium text-white transition-colors hover:text-white/80"
                        >
                          {link.text}
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Menu Actions */}
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
                      openAuthForm({ openapp: getOpenBrainParam() });
                      closeMobileMenu();
                    }}
                  >
                    Get Started Free
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
