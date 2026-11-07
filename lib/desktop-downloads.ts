const RELEASE_FEED = 'https://sealox.oss-cn-hangzhou.aliyuncs.com/app/';
export type DesktopDownload = {
  platform: 'mac-arm64' | 'mac-x64' | 'windows';
  url: string;
};

export function parseDesktopDownloadManifest(
  manifest: string,
): DesktopDownload[] {
  const downloads: DesktopDownload[] = [];
  for (const line of manifest.split('\n')) {
    const path = line.match(/^\s*-\s*url:\s*(.+?)\s*$/)?.[1];
    if (!path?.startsWith('releases/')) continue;
    const url = new URL(encodeURI(path), RELEASE_FEED);
    if (
      url.origin !== new URL(RELEASE_FEED).origin ||
      !url.pathname.startsWith('/app/releases/')
    )
      continue;
    const name = url.pathname.toLowerCase();
    const platform = name.endsWith('.dmg')
      ? /arm64|aarch64/.test(name)
        ? 'mac-arm64'
        : 'mac-x64'
      : name.endsWith('.exe')
        ? 'windows'
        : undefined;
    if (platform && !downloads.some((item) => item.platform === platform))
      downloads.push({ platform, url: url.toString() });
  }
  return downloads;
}

export async function getDesktopDownloads(): Promise<DesktopDownload[]> {
  const manifests = await Promise.allSettled(
    ['latest-mac.yml', 'latest.yml'].map(async (file) => {
      const response = await fetch(new URL(file, RELEASE_FEED), {
        cache: 'force-cache',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok
        ? parseDesktopDownloadManifest(await response.text())
        : [];
    }),
  );
  return manifests.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : [],
  );
}
