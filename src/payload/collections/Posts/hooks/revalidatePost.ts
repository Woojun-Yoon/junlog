import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '@/payload-types'

const getPostPath = (slug?: string | null) => (slug ? `/posts/${slug}` : null)

const revalidatePostListings = () => {
  revalidatePath('/')
  revalidatePath('/posts')
  revalidatePath('/posts/page/[pageNumber]', 'page')
  revalidatePath('/posts/category/[categorySlug]', 'page')
  revalidatePath('/posts/category/[categorySlug]/page/[pageNumber]', 'page')
}

const revalidatePostSitemaps = () => {
  revalidateTag('pages-sitemap')
  revalidateTag('posts-sitemap')
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  const isPublished = doc._status === 'published'
  const wasPublished = previousDoc?._status === 'published'
  const path = getPostPath(doc.slug)
  const oldPath = getPostPath(previousDoc?.slug)

  if (!isPublished && !wasPublished) {
    return doc
  }

  if (isPublished && path) {
    payload.logger.info(`Revalidating post at path: ${path}`)
    revalidatePath(path)
  }

  if (wasPublished && oldPath && oldPath !== path) {
    payload.logger.info(`Revalidating old post at path: ${oldPath}`)
    revalidatePath(oldPath)
  }

  payload.logger.info('Revalidating post listings and sitemaps')
  revalidatePostListings()
  revalidatePostSitemaps()

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate || doc?._status !== 'published') {
    return doc
  }

  const path = getPostPath(doc.slug)

  if (path) {
    payload.logger.info(`Revalidating deleted post at path: ${path}`)
    revalidatePath(path)
  }

  payload.logger.info('Revalidating post listings and sitemaps')
  revalidatePostListings()
  revalidatePostSitemaps()

  return doc
}
