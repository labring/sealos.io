/**
 * Download targets for the Sealos desktop app.
 *
 * Installer file names carry the version, so there is no stable direct URL
 * yet. Every target points at the public releases page for now; swap the
 * `href` values here once the release feed is resolved at build time.
 */
export type DesktopDownloadKey =
  | 'macArm64'
  | 'macX64'
  | 'windowsX64'
  | 'linuxX64'
  | 'linuxArm64';

export type DesktopPlatform = 'mac' | 'windows' | 'linux';

export const DESKTOP_RELEASES_URL =
  'https://github.com/sealox/sealox-releases/releases/latest';

export const DESKTOP_DOWNLOADS: Record<
  DesktopDownloadKey,
  { platform: DesktopPlatform; href: string }
> = {
  macArm64: { platform: 'mac', href: DESKTOP_RELEASES_URL },
  macX64: { platform: 'mac', href: DESKTOP_RELEASES_URL },
  windowsX64: { platform: 'windows', href: DESKTOP_RELEASES_URL },
  linuxX64: { platform: 'linux', href: DESKTOP_RELEASES_URL },
  linuxArm64: { platform: 'linux', href: DESKTOP_RELEASES_URL },
};

export const DESKTOP_DOWNLOAD_ORDER: DesktopDownloadKey[] = [
  'macArm64',
  'macX64',
  'windowsX64',
  'linuxX64',
  'linuxArm64',
];

/** What the browser tells us about the visitor's device. */
export interface DeviceSignals {
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
  mobile?: boolean;
  architecture?: string;
}

/**
 * Best guess of the visitor's build, or `null` on a phone or tablet, where the
 * desktop app cannot be installed. iPadOS Safari reports itself as a Mac, so a
 * touch-capable "Mac" counts as an iPad. Safari never exposes the CPU
 * architecture, so Macs default to Apple silicon.
 */
export function pickDesktopDownload(
  signals: DeviceSignals,
): DesktopDownloadKey | null {
  const ua = signals.userAgent;
  const platform = (signals.platform || ua).toLowerCase();
  const arch = (signals.architecture ?? '').toLowerCase();

  if (signals.mobile) return null;
  if (/android|iphone|ipad|ipod/i.test(ua)) return null;
  if (/iphone|ipad|ipod/.test(platform)) return null;
  if (platform.includes('mac') && signals.maxTouchPoints > 1) return null;

  if (platform.includes('win')) return 'windowsX64';
  if (platform.includes('linux')) {
    return arch === 'arm' || /aarch64|arm64/i.test(ua)
      ? 'linuxArm64'
      : 'linuxX64';
  }
  if (platform.includes('mac')) return arch === 'x86' ? 'macX64' : 'macArm64';
  return 'macArm64';
}

export async function detectDesktopDownload(): Promise<DesktopDownloadKey | null> {
  if (typeof navigator === 'undefined') return 'macArm64';
  const nav = navigator as Navigator & {
    userAgentData?: {
      platform?: string;
      mobile?: boolean;
      getHighEntropyValues?: (
        hints: string[],
      ) => Promise<{ architecture?: string }>;
    };
  };

  let architecture = '';
  try {
    const values = await nav.userAgentData?.getHighEntropyValues?.([
      'architecture',
    ]);
    architecture = values?.architecture ?? '';
  } catch {
    architecture = '';
  }

  return pickDesktopDownload({
    userAgent: nav.userAgent,
    platform: nav.userAgentData?.platform || nav.platform,
    maxTouchPoints: nav.maxTouchPoints ?? 0,
    mobile: nav.userAgentData?.mobile,
    architecture,
  });
}
