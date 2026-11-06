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

/**
 * Best guess of the visitor's installer. Safari never exposes the CPU
 * architecture, so Macs default to Apple silicon.
 */
export async function detectDesktopDownload(): Promise<DesktopDownloadKey> {
  if (typeof navigator === 'undefined') return 'macArm64';
  const nav = navigator as Navigator & {
    userAgentData?: {
      platform?: string;
      getHighEntropyValues?: (
        hints: string[],
      ) => Promise<{ architecture?: string; bitness?: string }>;
    };
  };
  const platform = (
    nav.userAgentData?.platform ||
    nav.platform ||
    nav.userAgent
  ).toLowerCase();

  let arch = '';
  try {
    const values = await nav.userAgentData?.getHighEntropyValues?.([
      'architecture',
    ]);
    arch = values?.architecture?.toLowerCase() ?? '';
  } catch {
    arch = '';
  }

  if (platform.includes('win')) return 'windowsX64';
  if (platform.includes('linux') && !/android/i.test(nav.userAgent)) {
    return arch === 'arm' || /aarch64|arm64/i.test(nav.userAgent)
      ? 'linuxArm64'
      : 'linuxX64';
  }
  if (platform.includes('mac')) return arch === 'x86' ? 'macX64' : 'macArm64';
  return 'macArm64';
}
