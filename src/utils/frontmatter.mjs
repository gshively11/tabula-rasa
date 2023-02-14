import getReadingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'

/**
 * Estimates the reading time of a file and stores it in the frontmatter.
 */
export function readingTimeRemarkPlugin() {
  return function (tree, file) {
    const textOnPage = toString(tree)
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes)

    file.data.astro.frontmatter.readingTime = readingTime
  }
}
