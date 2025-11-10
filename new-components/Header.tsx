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
import { Menu, X } from 'lucide-react';
import {
  useScroll,
  motion,
  useMotionValueEvent,
  AnimatePresence,
} from 'motion/react';
import Image from 'next/image';
import React from 'react';
import DevBoxIcon from '@/assets/sealos-appicons/devbox.svg';
import DatabaseIcon from '@/assets/sealos-appicons/database.svg';
import AppStoreIcon from '@/assets/sealos-appicons/appstore.svg';
import GitHubIcon from '@/assets/github.svg';
import { useGTM } from '@/hooks/use-gtm';
import { siteConfig } from '@/config/site';
import { getBrainUrl } from '@/lib/utils/brain';

// 产品图标映射
const productIcons: Record<string, any> = {
  DevBox: DevBoxIcon,
  Databases: DatabaseIcon,
  'App Store': AppStoreIcon,
};

// 导航链接数据
const navigationLinks = [
  {
    text: 'Products',
    url: '#',
    isExternal: false,
    children: [
      {
        text: 'DevBox',
        url: '/products/devbox',
        isExternal: false,
      },
      {
        text: 'Databases',
        url: '/products/databases',
        isExternal: false,
      },
      {
        text: 'App Store',
        url: '/products/app-store',
        isExternal: false,
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
      },
      {
        text: 'Gaming',
        url: '/solutions/industries/gaming',
        isExternal: false,
      },
      {
        text: 'Information Technology',
        url: '/solutions/industries/information-technology',
        isExternal: false,
      },
    ],
  },
  {
    text: 'Contact',
    url: '/contact',
    isExternal: false,
  },
];

export function Header() {
  const { trackButton } = useGTM();

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
      <nav className="flex w-full justify-between rounded-full bg-white/5 px-6 py-3 inset-shadow-[0_0_20px_0_rgba(255,255,255,0.10),_0_-1px_4px_0_rgba(255,255,255,0.25)] backdrop-blur-lg">
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
                    <>
                      <NavigationMenuTrigger>{link.text}</NavigationMenuTrigger>
                      <NavigationMenuContent className="p-2 shadow-md">
                        <ul className="w-full min-w-[12rem]" aria-hidden="true">
                          {link.children.map((child, childIndex) => (
                            <li key={childIndex} aria-hidden="true">
                              <NavigationMenuLink asChild>
                                <a
                                  href={child.url}
                                  className="flex-row items-center gap-2"
                                  target={
                                    child.isExternal ? '_blank' : undefined
                                  }
                                  rel={
                                    child.isExternal
                                      ? 'noopener noreferrer'
                                      : undefined
                                  }
                                  aria-hidden="false"
                                >
                                  {link.text === 'Products' &&
                                  productIcons[child.text] ? (
                                    <Image
                                      src={productIcons[child.text]}
                                      alt=""
                                      width={16}
                                      height={16}
                                      className="rounded"
                                      aria-hidden="true"
                                    />
                                  ) : null}
                                  <span>{child.text}</span>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
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
            asChild
            variant="landing-primary"
            className="hidden h-10 lg:flex"
            // [FIXME] Workaround for global CSS override for borders.
            style={{
              border: '1px solid #ffffff',
            }}
            aria-label="Start using Sealos for free."
          >
            <a
              href={siteConfig.links.mainCta}
              onClick={() =>
                trackButton(
                  'Get Started',
                  'header',
                  'url',
                  siteConfig.links.mainCta,
                )
              }
            >
              Get Started Free
            </a>
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
                                      className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                                    >
                                      {link.text === 'Products' &&
                                      productIcons[child.text] ? (
                                        <Image
                                          src={productIcons[child.text]}
                                          alt={`${child.text} icon`}
                                          width={16}
                                          height={16}
                                          className="rounded"
                                        />
                                      ) : null}
                                      <span>{child.text}</span>
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
                  >
                    <a href={getBrainUrl()} onClick={closeMobileMenu}>
                      Get Started Free
                    </a>
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
