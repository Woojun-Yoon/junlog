import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '@/payload-types'

const getPagePath = (slug?: string | null) => {
  if (slug === 'home') {
    return '/'
  }

  return slug ? `/${slug}` : null
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  const isPublished = doc._status === 'published'
  const wasPublished = previousDoc?._status === 'published'
  const path = getPagePath(doc.slug)
  const oldPath = getPagePath(previousDoc?.slug)

  if (!isPublished && !wasPublished) {
    return doc
  }

  if (isPublished && path) {
    payload.logger.info(`Revalidating page at path: ${path}`)
    revalidatePath(path)
  }

  if (wasPublished && oldPath && oldPath !== path) {
    payload.logger.info(`Revalidating old page at path: ${oldPath}`)
    revalidatePath(oldPath)
  }

  revalidateTag('pages-sitemap')

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate || doc?._status !== 'published') {
    return doc
  }

  const path = getPagePath(doc.slug)

  if (path) {
    payload.logger.info(`Revalidating deleted page at path: ${path}`)
    revalidatePath(path)
  }

  revalidateTag('pages-sitemap')

  return doc
}
