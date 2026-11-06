import Link from 'next/link';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import type { languagesType } from '@/lib/i18n';
import { footerTranslations } from '@/new-components/Footer/footer-links';
import type { HomeCopy } from '../content';
import { LanguageMenu } from '../components/nav';
import { ThemeToggle } from '../components/theme';

type FooterColumn = {
  titleKey: string;
  links: Array<
    { textKey: string; urlKey: string } | { text: string; url: string }
  >;
};

const columns: FooterColumn[] = [
  {
    titleKey: 'productsTitle',
    links: [
      { textKey: 'skills', urlKey: 'skillsUrl' },
      { textKey: 'templates', urlKey: 'templatesUrl' },
      { textKey: 'pricing', urlKey: 'pricingUrl' },
      { textKey: 'fastgpt', urlKey: 'fastgptUrl' },
    ],
  },
  {
    titleKey: 'resourcesTitle',
    links: [
      { textKey: 'docs', urlKey: 'docsUrl' },
      { textKey: 'blog', urlKey: 'blogUrl' },
      { textKey: 'faqShort', urlKey: 'faqUrl' },
      { textKey: 'education', urlKey: 'educationUrl' },
    ],
  },
  {
    titleKey: 'supportTitle',
    links: [
      { textKey: 'contactUs', urlKey: 'contactUsUrl' },
      { textKey: 'reportAbuse', urlKey: 'reportAbuseUrl' },
    ],
  },
  {
    titleKey: 'legalTitle',
    links: [
      { textKey: 'termsOfService', urlKey: 'termsOfServiceUrl' },
      { textKey: 'privacyPolicy', urlKey: 'privacyPolicyUrl' },
      { textKey: 'cookiePolicy', urlKey: 'cookiePolicyUrl' },
    ],
  },
  {
    titleKey: 'connectTitle',
    links: [
      { text: 'GitHub', url: siteConfig.links.github },
      { text: 'Discord', url: siteConfig.links.discord },
      { text: 'X', url: siteConfig.links.twitter },
      { text: 'YouTube', url: siteConfig.links.youtube },
      { text: 'RSS', url: '/rss.xml' },
    ],
  },
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
    // The RSS feed is a root-level route and is not localized.
    const target = href.endsWith('.xml') ? href : localize(href);
    return <Link href={target}>{children}</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sx-footer-external" aria-hidden>
        ↗
      </span>
    </a>
  );
}

export function HomeFooter({
  copy,
  lang,
  localize,
}: {
  copy: HomeCopy;
  lang: languagesType;
  localize: (href: string) => string;
}) {
  const t = footerTranslations[lang] ?? footerTranslations.en;

  return (
    <footer className="sx-footer">
      <div className="sx-container">
        <nav aria-label="Footer" className="sx-footer-columns">
          {columns.map((column) => (
            <div key={column.titleKey}>
              <p className="sx-footer-title">{t[column.titleKey]}</p>
              <ul className="sx-footer-links">
                {column.links.map((link) => {
                  const text = 'text' in link ? link.text : t[link.textKey];
                  const url = 'url' in link ? link.url : t[link.urlKey];
                  return (
                    <li key={text}>
                      <FooterLink href={url} localize={localize}>
                        {text}
                      </FooterLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="sx-footer-bottom">
          <small className="sx-footer-copyright">{t.copyrightShort}</small>
          <div className="sx-footer-controls">
            <LanguageMenu lang={lang} label={copy.nav.language} />
            <ThemeToggle labels={copy.nav.theme} />
          </div>
        </div>
      </div>
    </footer>
  );
}
