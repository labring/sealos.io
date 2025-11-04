import {
  defineDocs,
  defineConfig,
  defineCollections,
  frontmatterSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';
import { remarkInstall } from 'fumadocs-docgen';

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
  }),
});

export const aiQuickReference = defineCollections({
  dir: 'content/ai-quick-reference',
  type: 'doc',
  schema: frontmatterSchema.extend({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    keywords: z.array(z.string()).default([]),
  }),
});

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    remarkPlugins: [remarkInstall],
    remarkImageOptions: {
      external: process.env.DOCKER_BUILD === 'true' ? false : undefined,
    },
  },
});
