import path from 'path'
import { fileURLToPath } from 'url'
import compress from 'astro-compress'
import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import { SITE } from './src/frontend-config.mjs'
import { readingTimeRemarkPlugin } from './src/utils/frontmatter.mjs'
import node from '@astrojs/node'

// absolute path of the directory that houses this file
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://astro.build/config
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
  output: 'server',
  site: SITE.origin,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
  adapter: node({
    mode: 'middleware',
  }),
})
