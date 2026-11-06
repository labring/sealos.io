import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { ReactNode } from 'react';
import { HomeThemeProvider, THEME_INIT_SCRIPT } from './components/theme';
import './home.css';
import './faux.css';

export default function DesktopHomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {/* The hero panel's background is the largest paint on the page; a CSS
          background cannot be discovered until the stylesheet loads. */}
      <link
        rel="preload"
        as="image"
        href="/images/desktop-home/watercolor-hero.webp"
        fetchPriority="high"
      />
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      <HomeThemeProvider>
        <div
          id="sx-home"
          className={`${GeistSans.variable} ${GeistMono.variable}`}
        >
          {children}
        </div>
      </HomeThemeProvider>
    </>
  );
}
