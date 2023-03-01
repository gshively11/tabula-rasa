/*
 * This file configures Svelte, a web application framework.
 * https://kit.svelte.dev/docs/configuration
 *
 * We use it for interactive components running in Astro islands.
 */
import { vitePreprocess } from '@astrojs/svelte'

export default {
  preprocess: vitePreprocess(),
}
