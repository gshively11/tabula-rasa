export interface Post {
  id: string
  slug: string

  publishDate: Date
  title: string
  description?: string

  image?: string

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
