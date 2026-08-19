import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/payload/fields/Link/linkGroup'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      label: '안내 문구',
      admin: {
        description: '독자의 다음 행동을 안내하는 문구로 버튼 옆에 표시됩니다.',
      },
      editor: lexicalEditor({
        admin: {
          placeholder: '예: 더 자세한 내용은 관련 문서에서 확인하세요.',
        },
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        label: '버튼 링크',
        labels: {
          plural: '버튼',
          singular: '버튼',
        },
        admin: {
          description: '공개 페이지에 표시할 버튼을 최대 2개 추가하세요.',
        },
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: '행동 유도 (CTA)',
    singular: '행동 유도 (CTA)',
  },
}
