import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_FAQ_SOURCE_COUNT,
  DEFAULT_FAQ_SOURCE_DIRECTORY,
  compareFAQIndexRecords,
  decodeJSONBuffer,
  formatFAQIndexReport,
  inspectCanonicalFAQSource,
} from './ai-faq-index.mjs';

export const DEFAULT_FAQ_INDEX_PATH = resolve('public/ai-faqs.en.json');

const DEFAULT_FILESYSTEM = { readFile };

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

async function inspectFAQIndex(indexPath, filesystem) {
  const readIndexFile = filesystem.readFile ?? readFile;
  let indexBytes;

  try {
    indexBytes = await readIndexFile(indexPath);
  } catch (error) {
    return {
      records: null,
      bytes: Buffer.alloc(0),
      findings: [
        {
          category: 'index-read-failure',
          id: null,
          indexPath,
          code: error?.code ?? 'INDEX_READ_FAILED',
          field: '$read',
          expected: 'readable index file',
          actual: getErrorMessage(error),
        },
      ],
    };
  }

  try {
    return {
      records: decodeJSONBuffer(indexBytes),
      bytes: Buffer.from(indexBytes),
      findings: [],
    };
  } catch (error) {
    return {
      records: null,
      bytes: Buffer.from(indexBytes),
      findings: [
        {
          category: 'invalid-index-json',
          id: null,
          indexPath,
          code: error?.code ?? 'INVALID_INDEX_JSON',
          field: '$json',
          expected: 'valid UTF-8 JSON',
          actual: getErrorMessage(error),
        },
      ],
    };
  }
}

export async function runVerifyFAQIndex({
  sourceDirectory = DEFAULT_FAQ_SOURCE_DIRECTORY,
  indexPath = DEFAULT_FAQ_INDEX_PATH,
  expectedCount = DEFAULT_FAQ_SOURCE_COUNT,
  stdout = process.stdout,
  stderr = process.stderr,
  filesystem = DEFAULT_FILESYSTEM,
} = {}) {
  try {
    const sourceInspection = await inspectCanonicalFAQSource({
      sourceDirectory,
      expectedCount,
      filesystem,
    });
    const indexInspection = await inspectFAQIndex(indexPath, filesystem);
    const report = compareFAQIndexRecords({
      sourceRecords: sourceInspection.records,
      sourceFindings: sourceInspection.findings,
      indexRecords: indexInspection.records,
      indexFindings: indexInspection.findings,
      indexBytes: indexInspection.bytes,
    });
    const output = formatFAQIndexReport(report);

    (report.ok ? stdout : stderr).write(output);
    return report.ok ? 0 : 1;
  } catch (error) {
    stderr.write(
      `AI FAQ index parity failed for public/ai-faqs.en.json.\n` +
        `AI FAQ index verification error: ${getErrorMessage(error)}\n` +
        'Regenerate with: pnpm generate:ai-faq-index\n',
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
