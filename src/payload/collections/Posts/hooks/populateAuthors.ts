import type { CollectionAfterReadHook } from 'payload'
import { User } from '@/payload-types'

const sanitizeText = (value?: string | null) => {
  const trimmed = value?.trim()

  return trimmed ? trimmed : undefined
}

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req, req: { payload } }) => {
  if (doc?.authors) {
    const authorDocs: User[] = []

    for (const author of doc.authors) {
      const authorDoc = await payload.findByID({
        id: typeof author === 'object' ? author?.id : author,
        collection: 'users',
        depth: 1,
        req,
      })

      if (authorDoc) {
        authorDocs.push(authorDoc)
      }
    }

    doc.populatedAuthors = authorDocs.map((authorDoc) => ({
      id: authorDoc.id,
      name: authorDoc.name,
      bio: sanitizeText(authorDoc.bio),
      website: sanitizeText(authorDoc.website),
      githubUrl: sanitizeText(authorDoc.githubUrl),
      profileImage: authorDoc.profileImage,
    }))
  }

  return doc
}
