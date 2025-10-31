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

const enableRemoteImageProcessing = process.env.ENABLE_REMARK_IMAGE === 'true';

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    remarkPlugins: [remarkInstall],
    // Disable remarkImage by default to keep builds deterministic in restricted environments.
    // When remote image metadata is required, set ENABLE_REMARK_IMAGE=true.
    remarkImageOptions: enableRemoteImageProcessing ? undefined : false,
  },
});
