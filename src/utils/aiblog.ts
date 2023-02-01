import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'
import type { Post } from '~/types'
import { cleanSlug, getAbsoluteLink, getRelativeLink, trimSlash } from './links'

const generatePostSlug = async ({ id, slug, publishDate, category }) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0')
  const month = String(publishDate.getMonth() + 1).padStart(2, '0')
  const day = String(publishDate.getDate()).padStart(2, '0')
  const hour = String(publishDate.getHours()).padStart(2, '0')
  const minute = String(publishDate.getMinutes()).padStart(2, '0')
  const second = String(publishDate.getSeconds()).padStart(2, '0')

  const postSlug = slug
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second)

  return postSlug
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/')
}

const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
  const { id, slug: rawSlug = '', data } = post
  const { Content, remarkPluginFrontmatter } = await post.render()

  const {
    tags: rawTags = [],
    category: rawCategory,
    author = 'Anonymous',
    publishDate: rawPublishDate = new Date(),
    ...rest
  } = data

  const slug = cleanSlug(rawSlug.split('/').pop())
  const publishDate = new Date(rawPublishDate)
  const category = rawCategory ? cleanSlug(rawCategory) : undefined
  const tags = rawTags.map((tag: string) => cleanSlug(tag))
  const postSlug = await generatePostSlug({ id, slug, publishDate, category })

  return {
    id: id,
    slug: slug,

    publishDate: publishDate,
    category: category,
    tags: tags,
    author: author,

    ...rest,

    Content: Content,

    absoluteLink: getAbsoluteLink(postSlug, 'post'),
    relativeLink: trimSlash(getRelativeLink(postSlug, 'post')),

    readingTime: remarkPluginFrontmatter?.readingTime,
  }
}

const load = async function (): Promise<Array<Post>> {
  const posts = await getCollection('post')
  const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post))

  const results = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft)

  return results
}

let _posts: Array<Post>

export const fetchPosts = async (): Promise<Array<Post>> => {
  if (!_posts) {
    _posts = await load()
  }

  return _posts
}

export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(slugs)) return []

  const posts = await fetchPosts()

  return slugs.reduce(function (r: Array<Post>, slug: string) {
    posts.some(function (post: Post) {
      return slug === post.slug && r.push(post)
    })
    return r
  }, [])
}

export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(ids)) return []

  const posts = await fetchPosts()

  return ids.reduce(function (r: Array<Post>, id: string) {
    posts.some(function (post: Post) {
      return id === post.id && r.push(post)
    })
    return r
  }, [])
}

export const findLatestPosts = async ({ count }: { count?: number }): Promise<Array<Post>> => {
  const _count = count || 4
  const posts = await fetchPosts()

  return posts ? posts.slice(0, _count) : []
}
