import Link from 'next/link';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import type { languagesType } from '@/lib/i18n';
import { getFooterLinks } from '@/new-components/Footer/footer-links';
import {
  DiscordIcon,
  GithubIcon,
  RSSIcon,
  XIcon,
  YoutubeIcon,
} from '@/new-components/Footer/FooterIcons';
import { SealosMark } from '../components/icons';

const socialLinks: Array<{ href: string; title: string; icon: ReactNode }> = [
  { href: siteConfig.links.github, title: 'GitHub', icon: <GithubIcon /> },
  { href: siteConfig.links.discord, title: 'Discord', icon: <DiscordIcon /> },
  { href: siteConfig.links.twitter, title: 'X', icon: <XIcon /> },
  { href: siteConfig.links.youtube, title: 'YouTube', icon: <YoutubeIcon /> },
  { href: '/rss.xml', title: 'RSS Feed', icon: <RSSIcon /> },
];

function FooterLink({
  href,
  localize,
  children,
}: {
  href: string;
  localize: (href: string) => string;
  children: ReactNode;
}) {
  if (href.startsWith('/')) {
    return <Link href={localize(href)}>{children}</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function HomeFooter({
  lang,
  localize,
}: {
  lang: languagesType;
  localize: (href: string) => string;
}) {
  const footer = getFooterLinks(lang);

  return (
    <footer className="sx-footer">
      <div className="sx-container">
        <Link
          href={localize('/') || '/'}
          className="sx-brand"
          aria-label="Sealos"
        >
          <SealosMark className="sx-brand-mark" />
          <span>Sealos</span>
        </Link>
        <nav aria-label="Footer" className="sx-footer-columns">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h2 className="sx-footer-title">{column.title}</h2>
              <ul className="sx-footer-links">
                {column.links.map((link) => (
                  <li key={link.text}>
                    <FooterLink href={link.url} localize={localize}>
                      {link.text}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="sx-footer-bottom">
          <ul className="sx-footer-legal">
            {footer.legal.map((link) => (
              <li key={link.text}>
                <FooterLink href={link.url} localize={localize}>
                  {link.text}
                </FooterLink>
              </li>
            ))}
          </ul>
          <span>{footer.copyright}</span>
          <ul className="sx-footer-social">
            {socialLinks.map((link) => (
              <li key={link.title}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.title}
                  aria-label={link.title}
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
