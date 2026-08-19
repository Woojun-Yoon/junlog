import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      label: '미디어 파일',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          '선택한 미디어와 캡션이 본문 또는 페이지의 한 구역으로 표시됩니다.',
      },
    },
  ],
  labels: {
    plural: '미디어',
    singular: '미디어',
  },
}
