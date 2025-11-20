export function getOpenBrainParam(query?: string): string {
  if (query) {
    return encodeURIComponent(`system-brain?query=${encodeURIComponent(query)}&trial=true`);
  } else {
    return encodeURIComponent('system-brain?trial=true');
  }
}
