export function isHomepage(pathname: string): boolean {
  // 主页路径: / 或 /[lang]
  // 路径格式: / 或 /en 或 /zh-cn 等
  return pathname === '/' || /^\/[a-z]{2}(-[a-z]{2})?$/.test(pathname);
}
