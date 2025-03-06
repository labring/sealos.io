import { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  i18n: true,
  disableThemeSwitch: true,
  nav: {
    title: (
      <div className="flex items-center gap-1">
        <Image alt="" src="/logo.svg" width={32} height={32} />
        <span className="hidden text-base font-bold md:block">Sealos</span>
      </div>
    ),
  },
  githubUrl: 'https://github.com/labring/sealos',
  links: [
    {
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
  ],
};

export const HeaderLinks = [
  {
    text: 'DevBox',
    url: '/devbox',
  },
  {
    text: 'App Store',
    isExternal: true,
    url: 'https://template.usw.sealos.io',
  },
  {
    text: 'Docs',
    url: '/docs',
  },
  // {
  //   text: 'Pricing',
  //   url: '/pricing',
  // },
  // {
  //   text: 'Blog',
  //   url: '/blog',
  // },
  {
    text: 'Contact',
    url: 'mailto:contact@sealos.io',
  },
];
