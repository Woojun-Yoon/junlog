import type { CollectionConfig } from 'payload'

import { anyone } from '@/payload/auth/anyone'
import { authenticated } from '@/payload/auth/authenticated'
import { slugField } from '@/payload/fields/slug'
import {
  revalidateCategory,
  revalidateDelete,
} from '@/payload/collections/Categories/hooks/revalidateCategory'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidateCategory],
    afterDelete: [revalidateDelete],
  },
}
