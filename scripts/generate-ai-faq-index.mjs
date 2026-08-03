import { randomUUID } from 'node:crypto';
import { rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_FAQ_SOURCE_COUNT,
  DEFAULT_FAQ_SOURCE_DIRECTORY,
  loadCanonicalFAQSource,
  serializeCanonicalFAQIndex,
} from './ai-faq-index.mjs';

export const DEFAULT_FAQ_INDEX_OUTPUT_PATH = resolve('public/ai-faqs.en.json');

const DEFAULT_FILESYSTEM = { rename, rm, writeFile };

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function createTemporaryPath(outputPath) {
  return join(
    dirname(outputPath),
    `.${basename(outputPath)}.${process.pid}.${randomUUID()}.tmp`,
  );
}

export async function runGenerateFAQIndex({
  sourceDirectory = DEFAULT_FAQ_SOURCE_DIRECTORY,
  outputPath = DEFAULT_FAQ_INDEX_OUTPUT_PATH,
  expectedCount = DEFAULT_FAQ_SOURCE_COUNT,
  stdout = process.stdout,
  stderr = process.stderr,
  filesystem = DEFAULT_FILESYSTEM,
} = {}) {
  let temporaryPath;
  let publicationError;
  let cleanupTemporaryPath = false;

  try {
    const sourceRecords = await loadCanonicalFAQSource({
      sourceDirectory,
      expectedCount,
    });
    const canonicalBytes = serializeCanonicalFAQIndex(sourceRecords);
    temporaryPath = createTemporaryPath(outputPath);
    cleanupTemporaryPath = true;

    try {
      await filesystem.writeFile(temporaryPath, canonicalBytes, {
        encoding: 'utf8',
        flag: 'wx',
      });
    } catch (error) {
      if (error?.code === 'EEXIST') {
        cleanupTemporaryPath = false;
      }
      throw error;
    }

    await filesystem.rename(temporaryPath, outputPath);
    cleanupTemporaryPath = false;
    stdout.write(
      `Generated ${sourceRecords.length} AI FAQ records at ${outputPath} (${Buffer.byteLength(
        canonicalBytes,
      )} bytes).\n`,
    );
    return 0;
  } catch (error) {
    publicationError = error;
    stderr.write(`AI FAQ index generation failed: ${getErrorMessage(error)}\n`);
    return 1;
  } finally {
    if (cleanupTemporaryPath && temporaryPath) {
      try {
        await filesystem.rm(temporaryPath, { force: true });
      } catch (cleanupError) {
        stderr.write(
          `AI FAQ index cleanup failed: ${getErrorMessage(cleanupError)}\n`,
        );
        if (!publicationError) {
          throw cleanupError;
        }
      }
    }
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  process.exitCode = await runGenerateFAQIndex();
}
