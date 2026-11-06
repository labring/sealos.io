/** Menus portal into the page root so they inherit its font and tokens. */
export function portalContainer(): HTMLElement | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.getElementById('sx-home') ?? undefined;
}
