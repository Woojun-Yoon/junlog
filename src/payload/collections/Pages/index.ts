import type { CollectionConfig } from "payload";

import { authenticated } from "@/payload/auth/authenticated";
import { authenticatedOrPublished } from "@/payload/auth/authenticatedOrPublished";
import { Archive } from "@/payload/blocks/ArchiveBlock/config";
import { CallToAction } from "@/payload/blocks/CallToAction/config";
import { Content } from "@/payload/blocks/Content/config";
import { MediaBlock } from "@/payload/blocks/MediaBlock/config";
import { slugField } from "@/payload/fields/slug";
import { populatePublishedAt } from "@/payload/hooks/populatePublishedAt";
import { generatePreviewPath } from "@/lib/utils/generatePreviewPath";
import { getCollectionURL } from "@/lib/utils/getURL";
import { revalidateDelete, revalidatePage } from "./hooks/revalidatePage";

import { OverviewField, PreviewField } from "@payloadcms/plugin-seo/fields";
import {
  createMetaDescriptionField,
  createMetaImageField,
  createMetaTitleField,
} from "@/payload/fields/seo";
import { HighImpactHero } from "@/payload/blocks/HighImpact/config";
import { MediumImpactHero } from "@/payload/blocks/MediumImpact/config";
import { LowImpactHero } from "@/payload/blocks/LowImpact/config";

export const Pages: CollectionConfig<"pages"> = {
  slug: "pages",
  labels: {
    singular: "페이지",
    plural: "페이지",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    components: {
      edit: {
        beforeDocumentControls: ["@/components/DocumentSidebarToggle"],
      },
    },
    defaultColumns: ["title", "slug", "updatedAt"],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === "string" ? data.slug : "",
          collection: "pages",
          req,
        });

        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === "string" ? data.slug : "",
        collection: "pages",
        req,
      }),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "페이지 제목",
      required: true,
      admin: {
        description:
          "브라우저 제목과 구조화 데이터의 기준입니다. 화면에 보이는 제목은 히어로 블록에서 작성하세요.",
        placeholder: "예: Junlog 소개",
      },
      validate: (value) => {
        if (typeof value === "string" && value.trim().length > 0) {
          return true;
        }

        return "페이지를 구분할 제목을 입력하세요.";
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "콘텐츠",
          fields: [
            {
              type: "blocks",
              name: "blocks",
              label: "페이지 구성",
              labels: {
                singular: "블록",
                plural: "블록",
              },
              blocks: [
                HighImpactHero,
                MediumImpactHero,
                LowImpactHero,
                CallToAction,
                Content,
                MediaBlock,
                Archive,
              ],
              admin: {
                description: "위에서 아래 순서대로 공개 페이지에 표시됩니다.",
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: "검색·공유 (SEO)",
          name: "meta",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            createMetaTitleField({
              description: "비워 두면 페이지 제목으로 자동 생성됩니다.",
              hasGenerateFn: true,
            }),
            createMetaImageField("media"),
            {
              type: "text",
              name: "canonicalUrl",
              label: "대표 URL",
              admin: {
                description:
                  "일반적으로 자동 URL을 사용합니다. 외부 원문이 있을 때만 직접 지정하세요.",
                placeholder: "https://example.com/original-page",
              },
              hooks: {
                beforeChange: [
                  async ({ data, value }) =>
                    !value ? getCollectionURL("pages", data?.slug) : value,
                ],
              },
            },
            createMetaDescriptionField({
              description:
                "비워 두면 사이트 기본 설명을 사용합니다. 검색 결과용 문구를 따로 쓸 때만 입력하세요.",
            }),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,
              // field paths to match the target field for data
              titlePath: "meta.title",
              descriptionPath: "meta.description",
            }),
          ],
        },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      label: "발행 일시",
      admin: {
        description:
          "비워 두고 발행하면 현재 시각이 기록됩니다. 예약 발행은 별도 예약 기능을 사용하세요.",
        position: "sidebar",
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 30000,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
};
