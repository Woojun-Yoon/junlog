import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/payload/fields/Link/link'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    label: '열 너비',
    admin: {
      description: '데스크톱 화면에서 이 열이 차지할 너비입니다.',
    },
    defaultValue: 'oneThird',
    options: [
      {
        label: '1/3',
        value: 'oneThird',
      },
      {
        label: '1/2',
        value: 'half',
      },
      {
        label: '2/3',
        value: 'twoThirds',
      },
      {
        label: '전체',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    label: '내용',
    admin: {
      description: '해당 열의 본문으로 공개 페이지에 표시됩니다.',
    },
    editor: lexicalEditor({
      admin: {
        placeholder: '이 열에 표시할 제목과 본문을 작성하세요.',
      },
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
  },
  {
    name: 'enableLink',
    type: 'checkbox',
    label: '링크 추가',
    admin: {
      description: '이 열 아래에 이동 링크를 표시할 때 선택하세요.',
    },
  },
  link({
    overrides: {
      label: '연결할 링크',
      admin: {
        condition: (_, { enableLink }) => Boolean(enableLink),
        description: '열의 내용을 읽은 뒤 이동할 대상을 설정합니다.',
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: '콘텐츠 열',
      labels: {
        plural: '열',
        singular: '열',
      },
      admin: {
        description:
          '데스크톱에서는 선택한 너비로 배치되고 모바일에서는 세로로 이어집니다.',
        initCollapsed: true,
      },
      fields: columnFields,
    },
  ],
  labels: {
    plural: '다단 콘텐츠',
    singular: '다단 콘텐츠',
  },
}
