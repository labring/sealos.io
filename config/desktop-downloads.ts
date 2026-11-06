/**
 * Download targets for the Sealos desktop app.
 *
 * Installer file names carry the version, so direct links are resolved from
 * the release feed manifests when the static site is built. A platform whose
 * manifest cannot be read falls back to the public releases page.
 */
export type DesktopDownloadKey =
  | 'macArm64'
  | 'macX64'
  | 'windowsX64'
  | 'linuxX64'
  | 'linuxArm64';

export type DesktopPlatform = 'mac' | 'windows' | 'linux';

/** Installer URL for each build. */
export type DesktopDownloadLinks = Record<DesktopDownloadKey, string>;

export const DESKTOP_RELEASES_URL =
  'https://github.com/sealox/sealox-releases/releases/latest';

export const DESKTOP_PLATFORMS: Record<DesktopDownloadKey, DesktopPlatform> = {
  macArm64: 'mac',
  macX64: 'mac',
  windowsX64: 'windows',
  linuxX64: 'linux',
  linuxArm64: 'linux',
};

export const FALLBACK_DESKTOP_DOWNLOAD_LINKS: DesktopDownloadLinks = {
  macArm64: DESKTOP_RELEASES_URL,
  macX64: DESKTOP_RELEASES_URL,
  windowsX64: DESKTOP_RELEASES_URL,
  linuxX64: DESKTOP_RELEASES_URL,
  linuxArm64: DESKTOP_RELEASES_URL,
};

/** A link to an installer file rather than the releases page. */
export const isDirectDownload = (href: string) => href !== DESKTOP_RELEASES_URL;

const DESKTOP_FEED_BASE_URL =
  'https://sealox-global.oss-us-west-1.aliyuncs.com/app/';

/** The release feed manifest that lists each build. */
const DESKTOP_MANIFEST: Record<DesktopDownloadKey, string> = {
  macArm64: 'latest-mac.yml',
  macX64: 'latest-mac.yml',
  windowsX64: 'latest.yml',
  linuxX64: 'latest-linux.yml',
  linuxArm64: 'latest-linux-arm64.yml',
};

const DESKTOP_FEED_MANIFESTS = [...new Set(Object.values(DESKTOP_MANIFEST))];

const MANIFEST_TIMEOUT_MS = 5000;

// File entries sit on their own line inside the top-level `files:` block, e.g.
// `  - url: releases/0.10.3/Sealos-0.10.3-mac-arm64.dmg`. Reading only that
// block keeps `releaseNotes` prose from being taken as file entries.
const FILE_URL_LINE = /^\s*-\s*url:\s*(.+?)\s*$/;

function classifyInstaller(fileName: string): DesktopDownloadKey | null {
  const name = fileName.toLowerCase();
  const arm = /arm64|aarch64/.test(name);
  if (name.endsWith('.dmg')) return arm ? 'macArm64' : 'macX64';
  if (name.endsWith('.exe')) return arm ? null : 'windowsX64';
  if (name.endsWith('.appimage')) return arm ? 'linuxArm64' : 'linuxX64';
  return null;
}

/** Installer links listed in one release feed manifest. */
export function parseDesktopManifest(
  manifest: string,
): Partial<DesktopDownloadLinks> {
  const links: Partial<DesktopDownloadLinks> = {};
  let inFiles = false;
  for (const line of manifest.split('\n')) {
    if (/^\S/.test(line)) inFiles = /^files:\s*$/.test(line);
    if (!inFiles) continue;
    const relativeUrl = line
      .match(FILE_URL_LINE)?.[1]
      ?.replace(/^['"]|['"]$/g, '');
    // Only asset paths published by the release pipeline are accepted.
    if (!relativeUrl?.startsWith('releases/')) continue;
    const key = classifyInstaller(relativeUrl.split('/').pop() ?? '');
    if (key && !links[key]) {
      links[key] = new URL(encodeURI(relativeUrl), DESKTOP_FEED_BASE_URL).href;
    }
  }
  return links;
}

async function fetchManifest(name: string): Promise<string> {
  const response = await fetch(new URL(name, DESKTOP_FEED_BASE_URL), {
    signal: AbortSignal.timeout(MANIFEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function loadDesktopDownloadLinks(): Promise<DesktopDownloadLinks> {
  const results = await Promise.allSettled(
    DESKTOP_FEED_MANIFESTS.map(fetchManifest),
  );
  const links: Partial<DesktopDownloadLinks> = {};
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.warn(
        `[desktop-downloads] Could not read ${DESKTOP_FEED_MANIFESTS[i]}: ${result.reason}`,
      );
      return;
    }
    for (const [key, href] of Object.entries(
      parseDesktopManifest(result.value),
    )) {
      links[key as DesktopDownloadKey] ??= href;
    }
  });

  const missing = DESKTOP_DOWNLOAD_ORDER.filter((key) => !links[key]);
  if (missing.length > 0) {
    console.warn(
      `[desktop-downloads] No installer for ${missing.join(', ')}; linking to the releases page instead.`,
    );
  }
  return { ...FALLBACK_DESKTOP_DOWNLOAD_LINKS, ...links };
}

let pendingLinks: Promise<DesktopDownloadLinks> | undefined;
const pendingLatest = new Map<string, Promise<Partial<DesktopDownloadLinks>>>();

/**
 * Direct installer links from the release feed. Runs at build time on the
 * server; never throws, so an unreachable feed cannot fail the site build.
 */
export function getDesktopDownloadLinks(): Promise<DesktopDownloadLinks> {
  pendingLinks ??= loadDesktopDownloadLinks();
  return pendingLinks;
}

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

/**
 * Newest links for one build, read in the browser so a release shows up
 * without a site deploy. Resolves to `{}` when the feed cannot be read (for
 * example while the bucket sends no CORS headers); the build-time links stay.
 */
export function getLatestDesktopDownloadLinks(
  key: DesktopDownloadKey,
): Promise<Partial<DesktopDownloadLinks>> {
  const name = DESKTOP_MANIFEST[key];
  let pending = pendingLatest.get(name);
  if (!pending) {
    pending = fetchManifest(name).then(parseDesktopManifest, () => ({}));
    pendingLatest.set(name, pending);
  }
  return pending;
}
