export interface Post {
  id: string
  slug: string

  publishDate: Date
  title: string
  description?: string

  image?: string
  imageDescription?: string

  canonical?: string | URL
  relativeLink?: string
  absoluteLink?: string

  draft?: boolean

  excerpt?: string
  category?: string
  tags?: Array<string>
  author?: string

  Content: unknown
  content?: string

  readingTime?: number
}

export interface MetaSEO {
  title?: string
  description?: string
  image?: string

  canonical?: string | URL
  noindex?: boolean
  nofollow?: boolean

  ogTitle?: string
  ogType?: string
}
