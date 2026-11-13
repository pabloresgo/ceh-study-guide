import { defineCollection, z } from 'astro:content';

/**
 * Each module page = one markdown file in src/content/modules/.
 *
 * The markdown BODY carries the narrative sections
 *   (Overview, Key Concepts, Methodology, Example Commands, Countermeasures).
 * Structured, render-as-UI data lives in FRONTMATTER so it can be laid out
 * consistently and filtered client-side:
 *   - objectives  -> "What you'll learn" callout
 *   - tools       -> filterable tool reference table
 *   - takeaways   -> "Key takeaways" callout
 */
const modules = defineCollection({
  type: 'content',
  schema: z.object({
    number: z.number().int().min(1).max(20),
    title: z.string(),
    summary: z.string(),
    icon: z.string(), // inline SVG id (see Icon.astro)
    category: z.enum([
      'Foundations',
      'Reconnaissance',
      'System & Network',
      'Application',
      'Infrastructure',
      'Defense & Crypto',
    ]),
    readTime: z.number().int().positive(), // minutes
    objectives: z.array(z.string()).default([]),
    tools: z
      .array(
        z.object({
          name: z.string(),
          purpose: z.string(),
          type: z.enum(['Open Source', 'Commercial', 'Built-in', 'Framework', 'Online']).default('Open Source'),
          source: z.string().url().optional(),
        })
      )
      .default([]),
    takeaways: z.array(z.string()).default([]),
  }),
});

export const collections = { modules };
