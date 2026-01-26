import {
  defineDocs,
  defineConfig,
  defineCollections,
  frontmatterSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';
import { remarkInstall } from 'fumadocs-docgen';
import { remarkMermaid } from './lib/remark/remark-mermaid';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
});

export const blog = defineCollections({
  dir: 'content/blog',
  type: 'doc',
  schema: frontmatterSchema.extend({
    title: z.string(),
    description: z.string(),
    date: z.string().date().or(z.date()),
    image: z.string().optional(),
    imageTitle: z.string().optional(),
    tags: z.array(z.string()).default([]),
    authors: z.array(z.string()).default([]),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),
    howTo: z
      .object({
        name: z.string(),
        description: z.string(),
        image: z.string().optional(),
        steps: z.array(
          z.object({
            name: z.string(),
            text: z.string(),
            image: z.string().optional(),
            tool: z
              .array(
                z.object({
                  name: z.string(),
                  url: z.string().optional(),
                  image: z.string().optional(),
                }),
              )
              .optional(),
            cost: z
              .union([
                z.string(),
                z.object({
                  '@type': z.literal('MonetaryAmount'),
                  currency: z.string(),
                  value: z.union([z.string(), z.number()]),
                }),
              ])
              .optional(),
          }),
        ),
      })
      .optional(),
  }),
});

export const aiQuickReference = defineCollections({
  dir: 'content/ai-quick-reference',
  type: 'meta',
  schema: frontmatterSchema.extend({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    keywords: z.array(z.string()).default([]),
    content: z.string(),
  }),
});

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    remarkPlugins: [remarkMermaid, remarkInstall],
    remarkImageOptions: {
      external: process.env.DOCKER_BUILD === 'true' ? false : undefined,
    },
  },
});
