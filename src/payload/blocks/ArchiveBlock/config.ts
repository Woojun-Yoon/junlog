import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          placeholder: '글 목록 위에 표시할 제목이나 안내 문구를 작성하세요.',
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
      label: '목록 소개',
      admin: {
        description: '선택한 글 목록 바로 위에 표시됩니다.',
      },
    },
    {
      name: 'populateBy',
      type: 'select',
      label: '글 선택 방식',
      admin: {
        description: '조건으로 자동 구성하거나 글을 직접 선택할 수 있습니다.',
      },
      defaultValue: 'collection',
      options: [
        {
          label: '조건으로 자동 구성',
          value: 'collection',
        },
        {
          label: '글 직접 선택',
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        description: '현재는 게시글 목록만 지원합니다.',
      },
      defaultValue: 'posts',
      label: '콘텐츠 유형',
      options: [
        {
          label: '게시글',
          value: 'posts',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        description:
          '선택한 카테고리에 속한 글만 표시합니다. 비워 두면 모든 카테고리를 대상으로 합니다.',
      },
      hasMany: true,
      label: '카테고리 필터',
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        description: '공개 페이지에 표시할 최대 글 개수입니다.',
        step: 1,
      },
      defaultValue: 10,
      label: '표시 개수',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
        description: '선택한 순서대로 공개 페이지에 표시됩니다.',
      },
      hasMany: true,
      label: '선택한 글',
      relationTo: ['posts'],
    },
  ],
  labels: {
    plural: '글 목록',
    singular: '글 목록',
  },
}
