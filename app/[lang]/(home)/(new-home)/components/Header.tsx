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
import { Circle, Menu, X } from 'lucide-react';
import {
  useScroll,
  motion,
  useMotionValueEvent,
  AnimatePresence,
} from 'motion/react';
import Image from 'next/image';
import React from 'react';

export function Header() {
  const { scrollY } = useScroll();
  const [hideLogotype, setHideLogotype] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProductsOpen, setIsProductsOpen] = React.useState(false);

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
    setIsProductsOpen(false);
  };

  return (
    <>
      <nav className="flex w-full justify-between rounded-full bg-white/5 px-6 py-3 inset-shadow-[0_0_20px_0_rgba(255,255,255,0.10),_0_-1px_4px_0_rgba(255,255,255,0.25)] backdrop-blur-lg">
        {/* Left */}
        <div className="flex">
          <div className="mr-4 flex items-center justify-center">
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
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent className="p-2 shadow-md">
                  <ul className="w-full min-w-[12rem]">
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="flex-row items-center gap-2">
                          <Circle size={16} />
                          <span>DevBox</span>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="flex-row items-center gap-2">
                          <Circle size={16} />
                          <span>Database</span>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="flex-row items-center gap-2">
                          <Circle size={16} />
                          <span>App Store</span>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <a href="#">Docs</a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <a href="#">Blog</a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <a href="#">Pricing</a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <a href="#">Solutions</a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <a href="#">Contact</a>
                </NavigationMenuLink>
              </NavigationMenuItem>
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
          >
            <a href="#" className="flex gap-2">
              <Circle size={16} />
              <span>16.4k</span>
            </a>
          </Button>
          <Button
            asChild
            variant="landing-primary"
            className="hidden h-10 lg:flex"
          >
            <a href="#">Start for free</a>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
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
                  <div className="flex items-center gap-2">
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
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </Button>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex flex-col gap-2">
                  {/* Products - 可展开项 */}
                  <div className="border-b border-white/10">
                    <button
                      onClick={() => setIsProductsOpen(!isProductsOpen)}
                      className="flex w-full items-center justify-between py-4 text-lg font-medium text-white transition-colors hover:text-white/80"
                    >
                      <span>Products</span>
                      <motion.div
                        animate={{ rotate: isProductsOpen ? 180 : 0 }}
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
                      {isProductsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3 pb-4 pl-4">
                            <a
                              href="#"
                              onClick={closeMobileMenu}
                              className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                            >
                              <Circle size={16} />
                              <span>DevBox</span>
                            </a>
                            <a
                              href="#"
                              onClick={closeMobileMenu}
                              className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                            >
                              <Circle size={16} />
                              <span>Database</span>
                            </a>
                            <a
                              href="#"
                              onClick={closeMobileMenu}
                              className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                            >
                              <Circle size={16} />
                              <span>App Store</span>
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Other Menu Items */}
                  <a
                    href="#"
                    onClick={closeMobileMenu}
                    className="border-b border-white/10 py-4 text-lg font-medium text-white transition-colors hover:text-white/80"
                  >
                    Docs
                  </a>
                  <a
                    href="#"
                    onClick={closeMobileMenu}
                    className="border-b border-white/10 py-4 text-lg font-medium text-white transition-colors hover:text-white/80"
                  >
                    Blog
                  </a>
                  <a
                    href="#"
                    onClick={closeMobileMenu}
                    className="border-b border-white/10 py-4 text-lg font-medium text-white transition-colors hover:text-white/80"
                  >
                    Pricing
                  </a>
                  <a
                    href="#"
                    onClick={closeMobileMenu}
                    className="border-b border-white/10 py-4 text-lg font-medium text-white transition-colors hover:text-white/80"
                  >
                    Solutions
                  </a>
                  <a
                    href="#"
                    onClick={closeMobileMenu}
                    className="border-b border-white/10 py-4 text-lg font-medium text-white transition-colors hover:text-white/80"
                  >
                    Contact
                  </a>
                </div>

                {/* Mobile Menu Actions */}
                <div className="mt-8 space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full rounded-full border-white/20 text-base text-white hover:bg-white/10"
                  >
                    <a
                      href="#"
                      className="flex gap-2"
                      onClick={closeMobileMenu}
                    >
                      <Circle size={16} />
                      <span>16.4k</span>
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="landing-primary"
                    className="h-12 w-full text-base"
                  >
                    <a href="#" onClick={closeMobileMenu}>
                      Start for free
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
