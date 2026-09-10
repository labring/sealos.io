import { remark } from 'remark';

export function getReadmeSummary(markdown: string) {
  const processor = remark();
  const tree = processor.parse(markdown);
  const paragraphs = tree.children
    .filter(
      (node) =>
        node.type === 'paragraph' &&
        node.children.some(
          (child) => child.type === 'text' && child.value.trim().length > 0,
        ),
    )
    .slice(0, 2);

  return paragraphs.map((paragraph) =>
    processor.stringify({ type: 'root', children: [paragraph] }),
  );
}
