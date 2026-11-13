import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages as a project site:
//   https://pabloresgo.github.io/ceh-study-guide/
// `site` + `base` are what make internal links resolve correctly there.
// Override with SITE / BASE env vars if you rename the repo or use a custom domain.
const SITE = process.env.SITE ?? 'https://pabloresgo.github.io';
const BASE = process.env.BASE ?? '/ceh-study-guide';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
