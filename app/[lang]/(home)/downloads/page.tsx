import { getDesktopDownloads } from '@/lib/desktop-downloads';

export const metadata = { title: 'Download Sealos Desktop' };

export default async function DesktopDownloadsPage({
  params,
}: {
  params: { lang: string };
}) {
  const downloads = await getDesktopDownloads();
  const chinese = params.lang === 'zh-cn';
  const labels = {
    'mac-arm64': 'Mac (Apple Silicon)',
    'mac-x64': 'Mac (Intel)',
    windows: 'Windows',
  };
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-24">
      <h1 className="text-4xl font-semibold">
        {chinese ? '下载 Sealos 桌面端' : 'Download Sealos Desktop'}
      </h1>
      <p>
        {chinese
          ? '安装后在 App 内选择国内或全球账号。'
          : 'After installation, choose China or Global inside the App.'}
      </p>
      <div className="flex flex-wrap gap-4">
        {downloads.map((item) => (
          <a
            key={item.platform}
            href={item.url}
            download
            className="rounded-lg border px-5 py-3"
          >
            {labels[item.platform]}
          </a>
        ))}
      </div>
      {!downloads.length && (
        <p>
          {chinese
            ? '安装包链接暂时不可用，请查看官方发布页。'
            : 'Installer links are temporarily unavailable. Visit the official releases page.'}
        </p>
      )}
      <p>
        <a
          href="https://github.com/sealox/sealox-releases/releases/latest"
          rel="noopener noreferrer"
          target="_blank"
          className="underline"
        >
          {chinese ? '所有发布版本' : 'All releases'}
        </a>
      </p>
    </main>
  );
}
