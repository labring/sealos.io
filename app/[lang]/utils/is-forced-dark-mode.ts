export function isForcedDarkMode(pathname: string): boolean {
  const PATHS = [
    {
      path: '/',
      match: 'full',
    },
    {
      path: '/pricing',
      match: 'full',
    },
    {
      path: '/ai-quick-reference',
      match: 'prefix',
    },
    {
      path: '/blog',
      match: 'prefix',
    },
    {
      path: '/docs',
      match: 'prefix',
    },
    {
      path: '/comparison',
      match: 'prefix',
    },
    {
      path: '/products/app-store',
      match: 'prefix',
    },
  ];

  // Match language codes at the start of the path (temporary solution)
  const re = new RegExp(/^\/(?:[a-z]{2}\/|[a-z]{2}-[a-z]{2}\/)?(.*)$/);
  const matches = pathname.match(re);

  const matchedPath = matches ? `/${matches[1]}` : pathname;
  return (
    PATHS.find((path) => {
      if (path.match === 'full') return matchedPath === path.path;
      if (path.match === 'prefix') return matchedPath.startsWith(path.path);
    }) !== undefined
  );
}
