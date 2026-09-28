export function getTemplateVideoId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) {
      return undefined;
    }

    const id =
      (url.hostname === 'youtube.com' || url.hostname === 'www.youtube.com') &&
      url.pathname === '/watch'
        ? url.searchParams.get('v')
        : url.hostname === 'youtu.be'
          ? url.pathname.slice(1)
          : null;

    return id?.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}
