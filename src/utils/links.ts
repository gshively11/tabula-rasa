import slugify from 'limax'

import { SITE, AIBLOG } from '~/config.mjs'
import { trim } from '~/utils/utils'

export const trimSlash = (s: string) => trim(trim(s, '/'))

const SITE_BASE_PATHNAME = SITE.basePathname
const AIBLOG_BASE_PATHNAME = AIBLOG.basePathname

const createPath = (...params: string[]) => {
  const paths = params
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/')
  return '/' + paths + (SITE.trailingSlash && paths ? '/' : '')
}

export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/')

export const AIBLOG_LANDING_RELATIVE = cleanSlug(AIBLOG?.landing?.pathname)
export const AIBLOG_LANDING_ABSOLUTE = createPath(AIBLOG_BASE_PATHNAME, AIBLOG_LANDING_RELATIVE)

export const AIBLOG_CATEGORY_RELATIVE = cleanSlug(AIBLOG?.category?.pathname)
export const AIBLOG_CATEGORY_ABSOLUTE = createPath(AIBLOG_BASE_PATHNAME, AIBLOG_CATEGORY_RELATIVE)

export const AIBLOG_TAG_RELATIVE = cleanSlug(AIBLOG?.tag?.pathname)
export const AIBLOG_TAG_ABSOLUTE = createPath(AIBLOG_BASE_PATHNAME, AIBLOG_TAG_RELATIVE)

export const getCanonical = (path = ''): string | URL => new URL(path, SITE.origin)

export const getRelativeLink = (slug = '', type = 'unknown'): string => {
  switch (type) {
    // category, tag, post, and page are aiblog links.
    case 'category':
      return createPath(AIBLOG_CATEGORY_RELATIVE, slug)
    case 'tag':
      return createPath(AIBLOG_TAG_RELATIVE, slug)
    // post and page do not have a prefix for links relative
    // to the aiblog base path
    case 'post':
    case 'page':
      return createPath(slug)

    default:
      return createPath(slug)
  }
}

export const getAbsoluteLink = (slug = '', type = 'unknown'): string => {
  switch (type) {
    // category, tag, post, and page are aiblog links.
    case 'category':
      return createPath(AIBLOG_CATEGORY_ABSOLUTE, trimSlash(slug))
    case 'tag':
      return createPath(AIBLOG_TAG_ABSOLUTE, trimSlash(slug))
    case 'post':
    case 'page':
      return createPath(AIBLOG_BASE_PATHNAME, trimSlash(slug))

    default:
      return createPath(slug)
  }
}

export const getAsset = (path: string): string =>
  '/' +
  [SITE_BASE_PATHNAME, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/')
