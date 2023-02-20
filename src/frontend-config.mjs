import defaultImage from './assets/images/default.png'

// Root config for the entire site
const CONFIG = {
  basePathname: '/',
  description: 'A profile for Grant Shively',
  dateFormatter: new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }),
  defaultImage: defaultImage,
  defaultTheme: 'system',
  language: 'en',
  origin: 'https://ihopethis.works',
  name: 'ihopethis.works',
  textDirection: 'ltr',
  title: 'ihopethis.works',
  trailingSlash: true,
}

// Config for AI-generated Blog project
CONFIG.aiBlog = {
  basePathname: '/projects/ai_blog/',
  basePathnameRegex: '\\/projects\\/ai_blog\\/',
  category: {
    disabled: false,
    noindex: true,
    pathname: 'category',
  },
  disabled: false,
  landing: {
    disabled: false,
    noindex: false,
    pathname: 'blog',
  },
  post: {
    disabled: false,
    noindex: false,
    pathname: '%slug%',
  },
  postsPerPage: 4,
  tag: {
    disabled: false,
    noindex: true,
    pathname: 'tag',
  },
}

// Config for The Button project
CONFIG.theButton = {}

export const AIBLOG = CONFIG.aiBlog
export const DATE_FORMATTER = CONFIG.dateFormatter
export const SITE = {
  ...CONFIG,
  aiBlog: undefined,
  theButton: undefined,
}
export const THEBUTTON = CONFIG.theButton
