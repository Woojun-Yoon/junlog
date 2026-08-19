import type { CollectionConfig } from "payload";

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";

import { anyone } from "@/payload/auth/anyone";
import { authenticated } from "@/payload/auth/authenticated";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "미디어",
    plural: "미디어",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "대체 텍스트",
      required: true,
      admin: {
        description:
          "이미지를 볼 수 없어도 같은 정보를 이해할 수 있게 핵심 의미를 설명하세요.",
        placeholder: "예: 예약 발행 일시를 선택하는 Payload Admin 화면",
      },
      validate: (value, { data }) => {
        const hasAlt = typeof value === "string" && value.trim().length > 0;

        if (data?.mimeType?.startsWith("image/") && !hasAlt) {
          return "이미지가 전달하는 핵심 의미를 대체 텍스트로 입력하세요.";
        }

        return true;
      },
    },
    {
      name: "caption",
      type: "richText",
      label: "캡션",
      admin: {
        description: "이미지 출처, 맥락, 추가 설명이 필요할 때 입력하세요.",
      },
      editor: lexicalEditor({
        admin: {
          placeholder: "예: Payload 공식 문서의 Admin 화면",
        },
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, "../public/media"),
    adminThumbnail: "thumbnail",
    focalPoint: true,
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
      },
      {
        name: "square",
        width: 500,
        height: 500,
      },
      {
        name: "small",
        width: 600,
      },
      {
        name: "medium",
        width: 900,
      },
      {
        name: "large",
        width: 1400,
      },
      {
        name: "xlarge",
        width: 1920,
      },
      {
        name: "og",
        width: 1200,
        height: 630,
        crop: "center",
      },
    ],
  },
};
