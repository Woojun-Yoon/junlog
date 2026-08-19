import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'style',
      type: 'select',
      label: '안내 유형',
      admin: {
        description: '공개 본문에서 의미에 맞는 아이콘과 색상으로 표시됩니다.',
      },
      defaultValue: 'info',
      options: [
        { label: '정보', value: 'info' },
        { label: '주의', value: 'warning' },
        { label: '오류', value: 'error' },
        { label: '성공', value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: '안내 문구',
      admin: {
        description:
          '본문에서 독자가 놓치지 않아야 할 내용을 강조해 표시합니다.',
      },
      editor: lexicalEditor({
        admin: {
          placeholder: '예: 이 설정은 배포 전에 반드시 확인하세요.',
        },
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
  labels: {
    plural: '강조 안내',
    singular: '강조 안내',
  },
}
