import type { Field } from 'payload'

import deepMerge from '@/lib/utils/deepMerge'

export type LinkAppearances = 'default' | 'outline'

export const appearanceOptions: Record<
  LinkAppearances,
  { label: string; value: string }
> = {
  default: {
    label: '기본',
    value: 'default',
  },
  outline: {
    label: '테두리',
    value: 'outline',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Record<string, unknown>
}) => Field

export const link: LinkType = ({
  appearances,
  disableLabel = false,
  overrides = {},
} = {}) => {
  const linkResult: Field = {
    name: 'link',
    type: 'group',
    label: '링크',
    admin: {
      description: '독자가 이동할 대상과 화면에 보이는 문구를 설정합니다.',
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            label: '연결 방식',
            admin: {
              description:
                '사이트 내부 문서인지 직접 입력할 URL인지 선택하세요.',
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: '사이트 내부 문서',
                value: 'reference',
              },
              {
                label: '외부 또는 직접 URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              description:
                '현재 페이지를 유지해야 하는 외부 링크에 사용하세요.',
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: '새 탭에서 열기',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
        description: '사이트 안의 페이지나 게시글로 연결합니다.',
      },
      label: '연결할 문서',
      relationTo: ['pages', 'posts'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
        description: '외부 사이트 주소 또는 직접 관리하는 경로를 입력하세요.',
        placeholder: 'https://example.com',
      },
      label: '직접 입력 URL',
      required: true,
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            description: '버튼이나 텍스트 링크에 독자가 보는 문구입니다.',
            placeholder: '예: 자세히 보기',
            width: '50%',
          },
          label: '링크 문구',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.outline,
    ]

    if (appearances) {
      appearanceOptionsToUse = appearances.map(
        (appearance) => appearanceOptions[appearance],
      )
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      label: '표시 스타일',
      admin: {
        description: '공개 페이지에서 링크가 보이는 스타일을 선택하세요.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
