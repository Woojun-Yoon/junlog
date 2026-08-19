import type { Block } from "payload";

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { linkGroup } from "@/payload/fields/Link/linkGroup";

export const MediumImpactHero: Block = {
  slug: "MediumImpactHero",
  interfaceName: "MediumImpactHeroBlock",
  fields: [
    {
      name: "richText",
      type: "richText",
      label: "히어로 문구",
      admin: {
        description:
          "페이지 상단에서 대표 이미지 위에 제목과 소개 문구로 표시됩니다.",
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
      label: "대표 이미지",
      relationTo: "media",
      required: true,
      admin: {
        description: "히어로 문구 아래에 페이지 대표 이미지로 표시됩니다.",
      },
    },
  ],
  labels: {
    plural: "기본형 히어로",
    singular: "기본형 히어로",
  },
};
