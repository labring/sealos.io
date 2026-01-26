type RemarkNode = {
  type?: string;
  lang?: string;
  value?: unknown;
  children?: RemarkNode[];
  [key: string]: unknown;
};

// Convert mermaid code blocks into the Mermaid component for legacy Fumadocs MDX.
export function remarkMermaid(): (tree: RemarkNode) => void {
  return (tree) => {
    transformMermaidBlocks(tree);
  };
}

function transformMermaidBlocks(node: RemarkNode | null | undefined): void {
  if (!node || !Array.isArray(node.children)) return;

  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];

    if (
      child?.type === 'code' &&
      typeof child.lang === 'string' &&
      child.lang.toLowerCase() === 'mermaid'
    ) {
      const chart = typeof child.value === 'string' ? child.value : '';
      node.children[i] = createMermaidNode(chart);
      continue;
    }

    transformMermaidBlocks(child);
  }
}

function createMermaidNode(chart: string): RemarkNode {
  const raw = JSON.stringify(chart);
  return {
    type: 'mdxJsxFlowElement',
    name: 'Mermaid',
    attributes: [
      {
        type: 'mdxJsxAttribute',
        name: 'chart',
        value: {
          type: 'mdxJsxAttributeValueExpression',
          value: raw,
          data: {
            estree: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'Literal',
                    value: chart,
                    raw,
                  },
                },
              ],
              sourceType: 'module',
            },
          },
        },
      },
    ],
    children: [],
  };
}
