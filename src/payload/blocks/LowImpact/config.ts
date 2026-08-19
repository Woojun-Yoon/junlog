import type { Block } from "payload";

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { linkGroup } from "@/payload/fields/Link/linkGroup";

export const LowImpactHero: Block = {
  slug: "LowImpactHero",
  interfaceName: "LowImpactHeroBlock",
  fields: [
    {
      name: "richText",
      type: "richText",
      label: "히어로 문구",
      admin: {
        description:
          "페이지 상단의 좁은 본문 영역에 제목과 소개 문구로 표시됩니다.",
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
        admin: {
          hidden: true,
        },
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: "텍스트형 히어로",
    singular: "텍스트형 히어로",
  },
};
