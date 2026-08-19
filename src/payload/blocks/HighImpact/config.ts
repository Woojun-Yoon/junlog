import type { Block } from "payload";

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { linkGroup } from "@/payload/fields/Link/linkGroup";

export const HighImpactHero: Block = {
  slug: "HighImpactHero",
  interfaceName: "HighImpactHeroBlock",
  fields: [
    {
      name: "richText",
      type: "richText",
      label: "히어로 문구",
      admin: {
        description:
          "페이지 최상단의 배경 이미지 위에 제목과 소개 문구로 표시됩니다.",
      },
      editor: lexicalEditor({
        admin: {
          placeholder: "페이지의 핵심 제목과 한 줄 소개를 작성하세요.",
        },
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
    },
    linkGroup({
      overrides: {
        label: "버튼 링크",
        labels: {
          plural: "버튼",
          singular: "버튼",
        },
        admin: {
          description: "히어로 문구 아래에 표시할 버튼을 최대 2개 추가하세요.",
        },
        maxRows: 2,
      },
    }),
    {
      name: "media",
      type: "upload",
      label: "배경 이미지",
      relationTo: "media",
      required: true,
      admin: {
        description:
          "페이지 최상단 전체 너비에 표시됩니다. 문구가 읽히는 이미지를 선택하세요.",
      },
    },
  ],
  labels: {
    plural: "강조형 히어로",
    singular: "강조형 히어로",
  },
};
