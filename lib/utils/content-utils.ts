import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';

/**
 * Strip HTML tags from string, replacing them with spaces
 */
export function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, ' ');
}

/**
 * Normalize whitespace in string (collapse multiple spaces to one)
 */
export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Escape HTML special characters for FAQ text
 */
export function escapeFaqText(value: string): string {
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderMarkdownToHtml(markdown: string): Promise<string> {
  return remark().use(remarkGfm).use(html).process(markdown).then((file) => {
    return file.toString();
  });
}

/**
 * Convert markdown content to plain text for FAQ schema
 */
export async function toFaqPlainText(answer?: string): Promise<string> {
  const rawAnswer = typeof answer === 'string' ? answer : '';
  if (!rawAnswer) return '';

  const htmlString = await renderMarkdownToHtml(rawAnswer).catch(() => '');
  const stripped = normalizeWhitespace(stripHtmlTags(htmlString));
  const fallback = normalizeWhitespace(rawAnswer);
  return escapeFaqText(stripped || fallback);
}
