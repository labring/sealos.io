export type WebsiteLoginSource = 'email' | 'google_one_tap';

export function setTokenLoginTracking(
  target: URL,
  source: WebsiteLoginSource,
  needInit: boolean,
) {
  target.searchParams.set('login_source', source);
  target.searchParams.set('login_user_type', needInit ? 'new' : 'existing');
}
