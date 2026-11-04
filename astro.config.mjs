// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dirol982.github.io',
  base: '/vagmotors',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
});
