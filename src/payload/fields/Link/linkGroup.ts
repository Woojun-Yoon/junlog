import type { ArrayField, Field } from 'payload'

import type { LinkAppearances } from './link'

import deepMerge from '@/lib/utils/deepMerge'
import { link } from './link'

type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false
  overrides?: Partial<ArrayField>
}) => Field

export const linkGroup: LinkGroupType = ({
  appearances,
  overrides = {},
} = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    label: '링크 목록',
    labels: {
      plural: '링크',
      singular: '링크',
    },
    fields: [
      link({
        appearances,
      }),
    ],
    admin: {
      description: '공개 페이지에 표시할 순서대로 링크를 추가하세요.',
      initCollapsed: true,
    },
  }

  return deepMerge(generatedLinkGroup, overrides)
}
