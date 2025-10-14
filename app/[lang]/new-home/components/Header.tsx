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
import { Circle } from 'lucide-react';
import { useScroll, motion, useMotionValueEvent } from 'motion/react';
import Image from 'next/image';
import React from 'react';

export function Header() {
  const { scrollY } = useScroll();
  const [hideLogotype, setHideLogotype] = React.useState(false);

  useMotionValueEvent(scrollY, 'change', (current) => {
    if (current > 0 && scrollY.getPrevious() !== 0) {
      setHideLogotype(true);
    } else {
      setHideLogotype(false);
    }
  });

  return (
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

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent className="p-2 shadow-md">
                <ul className="w-full min-w-[12rem]">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="#"
                        className="focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-md px-2 py-2.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
                      >
                        <Circle size={16} />
                        <span>DevBox</span>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="#"
                        className="focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-md px-2 py-2.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
                      >
                        <Circle size={16} />
                        <span>Database</span>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="#"
                        className="focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-md px-2 py-2.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
                      >
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
      <div className="flex gap-3">
        <Button asChild variant="ghost" className="h-10 rounded-full">
          <a href="#" className="flex gap-2">
            <Circle size={16} />
            <span>16.4k</span>
          </a>
        </Button>
        <Button asChild variant="landing-primary" className="h-10">
          <a href="#">Start for free</a>
        </Button>
      </div>
    </nav>
  );
}
