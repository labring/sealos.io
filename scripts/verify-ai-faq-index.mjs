import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_FAQ_SOURCE_COUNT,
  DEFAULT_FAQ_SOURCE_DIRECTORY,
  compareFAQIndexRecords,
  formatFAQIndexReport,
  loadCanonicalFAQSource,
} from './ai-faq-index.mjs';

export const DEFAULT_FAQ_INDEX_PATH = resolve('public/ai-faqs.en.json');

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

export async function runVerifyFAQIndex({
  sourceDirectory = DEFAULT_FAQ_SOURCE_DIRECTORY,
  indexPath = DEFAULT_FAQ_INDEX_PATH,
  expectedCount = DEFAULT_FAQ_SOURCE_COUNT,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  try {
    const sourceRecords = await loadCanonicalFAQSource({
      sourceDirectory,
      expectedCount,
    });
    const indexBytes = await readFile(indexPath, 'utf8');
    const indexRecords = JSON.parse(indexBytes);
    const report = compareFAQIndexRecords({
      sourceRecords,
      indexRecords,
      indexBytes,
    });
    const output = formatFAQIndexReport(report);

    (report.ok ? stdout : stderr).write(output);
    return report.ok ? 0 : 1;
  } catch (error) {
    stderr.write(
      `AI FAQ index parity failed for public/ai-faqs.en.json.\n` +
        `AI FAQ index verification error: ${getErrorMessage(error)}\n` +
        'Regenerate with: npm run generate:ai-faq-index\n',
    );
    return 1;
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  process.exitCode = await runVerifyFAQIndex();
}
