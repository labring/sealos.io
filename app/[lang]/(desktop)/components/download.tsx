'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useGTM } from '@/hooks/use-gtm';
import { getOpenBrainParam } from '@/lib/utils/brain';
import {
  DESKTOP_DOWNLOAD_ORDER,
  DESKTOP_DOWNLOADS,
  DESKTOP_RELEASES_URL,
  detectDesktopDownload,
  type DesktopDownloadKey,
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

function DownloadMenuContent({
  copy,
  detected,
  align = 'start',
  tracking,
}: {
  copy: DownloadCopy;
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
          const target = DESKTOP_DOWNLOADS[key];
          const Icon = PLATFORM_ICON[target.platform];
          return (
            <DropdownMenu.Item key={key} asChild className="sx-menu-item">
              <a
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
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
  detected,
  size,
  tracking,
}: {
  copy: DownloadCopy;
  detected: DesktopDownloadKey | undefined;
  size: 'lg' | 'xl';
  tracking: RybbitCtaTracking;
}) {
  const target = detected ? DESKTOP_DOWNLOADS[detected] : undefined;
  const Icon = target ? PLATFORM_ICON[target.platform] : undefined;
  return (
    <div className="sx-split" data-size={size}>
      <a
        className="sx-split-main"
        href={target?.href ?? DESKTOP_RELEASES_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-download={detected}
        {...trackingFor(tracking)}
      >
        {Icon ? <Icon className="sx-split-icon" /> : null}
        <span>
          {target ? copy[PLATFORM_LABEL[target.platform]] : copy.cta}
        </span>
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
  size = 'lg',
  tracking,
  signUpTracking,
  children,
}: {
  copy: DownloadCopy;
  size?: 'lg' | 'xl';
  tracking: RybbitCtaTracking;
  signUpTracking: RybbitCtaTracking;
  children?: ReactNode;
}) {
  const detected = useDetectedDownload();
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
  tracking,
}: {
  copy: DownloadCopy;
  tracking: RybbitCtaTracking;
}) {
  const detected = useDetectedDownload();
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
        detected={detected}
        align="end"
        tracking={tracking}
      />
    </DropdownMenu.Root>
  );
}
