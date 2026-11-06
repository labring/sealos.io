'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useGTM } from '@/hooks/use-gtm';
import { getOpenBrainParam } from '@/lib/utils/brain';
import {
  DESKTOP_DOWNLOAD_ORDER,
  DESKTOP_PLATFORMS,
  DESKTOP_RELEASES_URL,
  detectDesktopDownload,
  getLatestDesktopDownloadLinks,
  isDirectDownload,
  type DesktopDownloadKey,
  type DesktopDownloadLinks,
  type DesktopPlatform,
} from '@/config/desktop-downloads';
import {
  getRybbitCtaProps,
  type RybbitCtaTracking,
} from '@/lib/analytics/rybbit-cta';
import type { HomeCopy } from '../content';
import { portalContainer } from './portal';
import {
  AppleIcon,
  ArrowRight,
  CheckIcon,
  ChevronDown,
  DownloadIcon,
  LinuxIcon,
  WindowsIcon,
} from './icons';

type DownloadCopy = HomeCopy['download'];

/**
 * The visitor's build: `undefined` until detection runs in the browser, `null`
 * on a phone or tablet, where the desktop app cannot be installed.
 */
type DetectedDownload = DesktopDownloadKey | null | undefined;

let detection: Promise<DesktopDownloadKey | null> | undefined;

function useDetectedDownload(): DetectedDownload {
  const [detected, setDetected] = useState<DetectedDownload>(undefined);
  useEffect(() => {
    let alive = true;
    detection ??= detectDesktopDownload();
    detection.then((key) => {
      if (alive) setDetected(key);
    });
    return () => {
      alive = false;
    };
  }, []);
  return detected;
}

/**
 * Build-time links, upgraded in the browser to the newest release of the
 * visitor's build once that build is known.
 */
function useLatestLinks(
  links: DesktopDownloadLinks,
  detected: DetectedDownload,
): DesktopDownloadLinks {
  const [latest, setLatest] = useState(links);
  useEffect(() => {
    setLatest(links);
    if (!detected) return;
    let alive = true;
    getLatestDesktopDownloadLinks(detected).then((fresh) => {
      if (alive) setLatest({ ...links, ...fresh });
    });
    return () => {
      alive = false;
    };
  }, [links, detected]);
  return latest;
}

const toSnake = (key: string) =>
  key.replace(/[A-Z0-9]+/g, (m) => `_${m.toLowerCase()}`);

const PLATFORM_ICON: Record<DesktopPlatform, typeof AppleIcon> = {
  mac: AppleIcon,
  windows: WindowsIcon,
  linux: LinuxIcon,
};

function trackingFor(tracking: RybbitCtaTracking | undefined, suffix?: string) {
  if (!tracking) return {};
  return getRybbitCtaProps({
    ...tracking,
    id: suffix ? `${tracking.id}_${suffix}` : tracking.id,
  });
}

/** Installers download in place; the releases page opens in a new tab. */
function linkTarget(href: string) {
  return isDirectDownload(href)
    ? {}
    : { target: '_blank', rel: 'noopener noreferrer' };
}

function DownloadMenuContent({
  copy,
  links,
  detected,
  align = 'start',
  tracking,
}: {
  copy: DownloadCopy;
  links: DesktopDownloadLinks;
  detected: DetectedDownload;
  align?: 'start' | 'end' | 'center';
  tracking?: RybbitCtaTracking;
}) {
  return (
    <DropdownMenu.Portal container={portalContainer()}>
      <DropdownMenu.Content
        className="sx-menu"
        align={align}
        sideOffset={8}
        collisionPadding={16}
      >
        <DropdownMenu.Label className="sx-menu-label">
          {copy.menuLabel}
        </DropdownMenu.Label>
        {DESKTOP_DOWNLOAD_ORDER.map((key) => {
          const Icon = PLATFORM_ICON[DESKTOP_PLATFORMS[key]];
          return (
            <DropdownMenu.Item key={key} asChild className="sx-menu-item">
              <a
                href={links[key]}
                {...linkTarget(links[key])}
                data-recommended={key === detected || undefined}
                {...trackingFor(tracking, toSnake(key))}
              >
                <span className="sx-menu-icon">
                  <Icon />
                </span>
                <span className="sx-menu-text">{copy.options[key]}</span>
                <span className="sx-menu-trailing">
                  {key === detected ? <CheckIcon /> : null}
                </span>
              </a>
            </DropdownMenu.Item>
          );
        })}
        <DropdownMenu.Separator className="sx-menu-separator" />
        <DropdownMenu.Item asChild className="sx-menu-item">
          <a
            href={DESKTOP_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sx-menu-icon">
              <DownloadIcon />
            </span>
            <span className="sx-menu-text">{copy.allReleases}</span>
            <span className="sx-menu-trailing">
              <ArrowRight />
            </span>
          </a>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

const PLATFORM_LABEL: Record<
  DesktopPlatform,
  'forMac' | 'forWindows' | 'forLinux'
> = {
  mac: 'forMac',
  windows: 'forWindows',
  linux: 'forLinux',
};

/** Download pill: the label downloads the visitor's build, the chevron lists every build. */
function DownloadSplitButton({
  copy,
  links,
  detected,
  size,
  tracking,
}: {
  copy: DownloadCopy;
  links: DesktopDownloadLinks;
  detected: DesktopDownloadKey | undefined;
  size: 'lg' | 'xl';
  tracking: RybbitCtaTracking;
}) {
  const platform = detected ? DESKTOP_PLATFORMS[detected] : undefined;
  const Icon = platform ? PLATFORM_ICON[platform] : undefined;
  const href = detected ? links[detected] : DESKTOP_RELEASES_URL;
  return (
    <div className="sx-split" data-size={size}>
      <a
        className="sx-split-main"
        href={href}
        {...linkTarget(href)}
        data-download={detected}
        {...trackingFor(tracking)}
      >
        {Icon ? <Icon className="sx-split-icon" /> : null}
        <span>{platform ? copy[PLATFORM_LABEL[platform]] : copy.cta}</span>
      </a>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger
          className="sx-split-trigger"
          aria-label={copy.menuLabel}
          {...trackingFor(tracking, 'menu')}
        >
          <ChevronDown />
        </DropdownMenu.Trigger>
        <DownloadMenuContent
          copy={copy}
          links={links}
          detected={detected}
          tracking={tracking}
        />
      </DropdownMenu.Root>
    </div>
  );
}

/**
 * Primary download actions. Desktops get the download pill plus `children`;
 * phones and tablets get a desktop-only notice and a sign-up button instead.
 */
export function DownloadActions({
  copy,
  links,
  size = 'lg',
  tracking,
  signUpTracking,
  children,
}: {
  copy: DownloadCopy;
  links: DesktopDownloadLinks;
  size?: 'lg' | 'xl';
  tracking: RybbitCtaTracking;
  signUpTracking: RybbitCtaTracking;
  children?: ReactNode;
}) {
  const detected = useDetectedDownload();
  const latestLinks = useLatestLinks(links, detected);
  const { trackButton } = useGTM();
  const handleAuthRedirect = useAuthRedirect();

  if (detected === null) {
    const sizeClass = size === 'xl' ? 'sx-btn-xl' : 'sx-btn-lg';
    return (
      <>
        <button
          type="button"
          className={`sx-btn sx-btn-secondary ${sizeClass} sx-btn-notice`}
          disabled
        >
          {copy.desktopOnly}
        </button>
        <button
          type="button"
          className={`sx-btn sx-btn-primary ${sizeClass}`}
          {...getRybbitCtaProps(signUpTracking)}
          onClick={() => {
            trackButton('Sign Up', signUpTracking.location, 'auth-form', '');
            handleAuthRedirect({ openapp: getOpenBrainParam() });
          }}
        >
          {copy.signUp}
        </button>
      </>
    );
  }

  return (
    <>
      <DownloadSplitButton
        copy={copy}
        links={latestLinks}
        detected={detected}
        size={size}
        tracking={tracking}
      />
      {children}
    </>
  );
}

/** Compact nav button that opens the download menu; hidden on phones and tablets. */
export function NavDownloadButton({
  copy,
  links,
  tracking,
}: {
  copy: DownloadCopy;
  links: DesktopDownloadLinks;
  tracking: RybbitCtaTracking;
}) {
  const detected = useDetectedDownload();
  const latestLinks = useLatestLinks(links, detected);
  if (detected === null) return null;
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className="sx-btn sx-btn-primary sx-btn-md"
        {...trackingFor(tracking)}
      >
        <span>{copy.navCta}</span>
        <ChevronDown className="sx-btn-caret" />
      </DropdownMenu.Trigger>
      <DownloadMenuContent
        copy={copy}
        links={latestLinks}
        detected={detected}
        align="end"
        tracking={tracking}
      />
    </DropdownMenu.Root>
  );
}
