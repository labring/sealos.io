export function getBrainUrl(prompt?: string) {
  if (prompt) {
    return `https://os.sealos.io/?openapp=system-brain?/trial?${encodeURIComponent(`query=${prompt}&sessionId=${crypto.randomUUID()}`)}`;
  } else {
    return `https://os.sealos.io/?openapp=system-brain?/trial?${encodeURIComponent(`sessionId=${crypto.randomUUID()}`)}`;
  }
}
