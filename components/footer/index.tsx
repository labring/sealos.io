import React from 'react';
import { siteConfig, templateDomain } from '@/config/site';
import Link from 'fumadocs-core/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DiscordIcon, GithubIcon } from '../ui/icons';

interface FooterLinkColumnProps {
  children: React.ReactNode;
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ children }) => (
  <div className="flex flex-col justify-center space-y-4">{children}</div>
);

interface FooterLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  className,
  children,
}) => (
  <Link
    href={href}
    className={cn(
      'hover:underline-decoration-4 hover:underline-color-[#005B9C] text-sm font-medium text-custom-secondary-text hover:text-[#005B9C] hover:underline hover:underline-offset-4',
      className,
    )}
  >
    {children}
  </Link>
);

const Footer = async () => {
  return (
    <div className="relative w-full pt-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm max-xl:px-8 lg:flex-row">
        <div>
          <div className="mb-4 mr-4 md:flex">
            <Link
              href={'/'}
              aria-label={siteConfig.name}
              title={siteConfig.name}
              className="flex items-center gap-2 font-bold"
            >
              <Image
                alt={siteConfig.name}
                src="/logo.svg"
                className="h-7 w-7"
                width={30}
                height={30}
              />
              <span className="text-xl font-bold">{siteConfig.name}</span>
            </Link>
          </div>
          <div className="mt-3 text-xs font-medium text-custom-secondary-text sm:text-sm">
            {siteConfig.tagline}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 items-start gap-10 lg:mt-0">
          <FooterLinkColumn>
            <div className="text-base font-semibold uppercase text-black hover:text-black hover:no-underline">
              Resources
            </div>
            <FooterLink href="/docs/quick-start">Docs</FooterLink>
            <FooterLink href={templateDomain}>App Store</FooterLink>
          </FooterLinkColumn>
          <FooterLinkColumn>
            <div className="text-base font-semibold uppercase text-black hover:text-black hover:no-underline">
              Products
            </div>
            <FooterLink href="/devbox">DevBox</FooterLink>
          </FooterLinkColumn>
          <FooterLinkColumn>
            <div className="text-base font-semibold uppercase text-black hover:text-black hover:no-underline">
              Support
            </div>
            <FooterLink href="mailto:contact@sealos.io">Contact Us</FooterLink>
            {/* <FooterLink href="#">Contact Us</FooterLink> */}
          </FooterLinkColumn>
        </div>
      </div>

      <div className="mt-16 h-[1px] w-full bg-[#DDE7F7]"></div>
      <div className="flex max-w-7xl justify-between pb-6 pl-2 pt-4 mx-auto px-2">
        <div className="flex items-center space-x-2 text-[10px] font-normal text-custom-secondary-text md:text-sm">
          <FooterLink
            className="text-[10px] font-normal text-custom-secondary-text md:text-sm"
            href="/docs/msa/terms-of-service"
          >
            Terms of Service
          </FooterLink>
          <FooterLink
            className="text-[10px] font-normal text-custom-secondary-text md:text-sm"
            href="/docs/msa/privacy-policy"
          >
            Privacy Policy
          </FooterLink>
          <FooterLink
            className="text-[10px] font-normal text-custom-secondary-text md:text-sm"
            href="/legal/cookie-policy"
          >
            Cookie Policy
          </FooterLink>
          <div>|</div>
          <div>Copyright © 2024 Sealos. All rights reserved.</div>
        </div>
        <div className="flex space-x-4">
          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href={siteConfig.links.github}
            aria-label="GitHub"
          >
            <GithubIcon />
          </Link>

          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href={siteConfig.links.discord}
            aria-label="Discord"
          >
            <DiscordIcon />
          </Link>
          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href={siteConfig.links.twitter}
            aria-label="Twitter"
          >
            <Image
              src="/icons/twitter.svg"
              alt="Twitter"
              width={16}
              height={16}
              className="h-4 w-4"
            />
          </Link>
          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href={siteConfig.links.youtube}
            aria-label="YouTube"
          >
            <Image
              src="/icons/youtube.svg"
              alt="YouTube"
              width={16}
              height={16}
              className="h-4 w-4"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
