import path from 'path'
import { fileURLToPath } from 'url'

import compress from 'astro-compress'
import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

import { SITE } from './src/config.mjs'
import { readingTimeRemarkPlugin } from './src/utils/frontmatter.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: SITE.basePathname,
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    mdx(),
    compress({
      css: true,
      html: {
        removeAttributeQuotes: false,
      },
      img: false,
      js: true,
      logger: 1,
      svg: false,
    }),
  ],
  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },
  output: 'static',
  site: SITE.origin,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
})
