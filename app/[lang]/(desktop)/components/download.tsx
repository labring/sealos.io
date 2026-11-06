'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useEffect, useState } from 'react';
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
  ChevronRight,
  DownloadIcon,
  LinuxIcon,
  WindowsIcon,
} from './icons';

type DownloadCopy = HomeCopy['download'];

function useDetectedDownload() {
  const [detected, setDetected] = useState<DesktopDownloadKey>('macArm64');
  useEffect(() => {
    let alive = true;
    detectDesktopDownload().then((key) => {
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
  detected: DesktopDownloadKey;
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

/** Primary download pill: the label downloads, the chevron opens all builds. */
export function DownloadSplitButton({
  copy,
  size = 'lg',
  label,
  tracking,
}: {
  copy: DownloadCopy;
  size?: 'md' | 'lg';
  label?: string;
  tracking: RybbitCtaTracking;
}) {
  const detected = useDetectedDownload();
  return (
    <div className="sx-split" data-size={size}>
      <a
        className="sx-split-main"
        href={DESKTOP_DOWNLOADS[detected].href}
        target="_blank"
        rel="noopener noreferrer"
        data-download={detected}
        {...trackingFor(tracking)}
      >
        {label ?? copy.cta}
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

/** Compact nav button, opens the download menu. */
export function NavDownloadButton({
  copy,
  tracking,
}: {
  copy: DownloadCopy;
  tracking: RybbitCtaTracking;
}) {
  const detected = useDetectedDownload();
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className="sx-btn sx-btn-primary sx-btn-md"
        {...trackingFor(tracking)}
      >
        <span>{copy.cta}</span>
        <ChevronRight className="sx-btn-chevron" />
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

/** Closing call to action: the visitor's platform first, the others a click away. */
export function CtaDownloads({
  copy,
  tracking,
}: {
  copy: DownloadCopy;
  tracking: RybbitCtaTracking;
}) {
  const detected = useDetectedDownload();
  const platform = DESKTOP_DOWNLOADS[detected].platform;
  const Icon = PLATFORM_ICON[platform];
  const primaryLabel =
    platform === 'windows'
      ? copy.forWindows
      : platform === 'linux'
        ? copy.forLinux
        : copy.forMac;
  const secondary: DesktopDownloadKey =
    platform === 'mac' ? 'windowsX64' : 'macArm64';
  const SecondaryIcon = PLATFORM_ICON[DESKTOP_DOWNLOADS[secondary].platform];
  const secondaryLabel = platform === 'mac' ? copy.forWindows : copy.forMac;

  return (
    <div className="sx-cta-buttons">
      <a
        className="sx-btn sx-btn-primary sx-btn-xl"
        href={DESKTOP_DOWNLOADS[detected].href}
        target="_blank"
        rel="noopener noreferrer"
        data-download={detected}
        {...trackingFor(tracking)}
      >
        <Icon className="sx-btn-platform" />
        <span>{primaryLabel}</span>
        <ChevronRight className="sx-btn-chevron" />
      </a>
      <a
        className="sx-btn sx-btn-secondary sx-btn-xl"
        href={DESKTOP_DOWNLOADS[secondary].href}
        target="_blank"
        rel="noopener noreferrer"
        data-download={secondary}
        {...trackingFor(tracking, 'secondary')}
      >
        <SecondaryIcon className="sx-btn-platform" />
        <span>{secondaryLabel}</span>
        <DownloadIcon className="sx-btn-chevron" />
      </a>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger
          className="sx-cta-more"
          {...trackingFor(tracking, 'menu')}
        >
          <span>{copy.menuLabel}</span>
          <ChevronDown />
        </DropdownMenu.Trigger>
        <DownloadMenuContent
          copy={copy}
          detected={detected}
          align="center"
          tracking={tracking}
        />
      </DropdownMenu.Root>
    </div>
  );
}
