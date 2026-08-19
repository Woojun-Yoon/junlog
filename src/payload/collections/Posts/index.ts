import type { CollectionConfig } from "payload";

import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  ChecklistFeature,
  CodeBlock,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnorderedListFeature,
  UploadFeature,
} from "@payloadcms/richtext-lexical";

import { authenticated } from "@/payload/auth/authenticated";
import { authenticatedOrPublished } from "@/payload/auth/authenticatedOrPublished";
import { Banner } from "@/payload/blocks/Banner/config";
import { MediaBlock } from "@/payload/blocks/MediaBlock/config";
import { generatePreviewPath } from "@/lib/utils/generatePreviewPath";
import { getCollectionURL } from "@/lib/utils/getURL";
import { populateAuthors } from "./hooks/populateAuthors";
import { revalidateDelete, revalidatePost } from "./hooks/revalidatePost";
import { setContentUpdatedAt } from "./hooks/setContentUpdatedAt";

import { OverviewField, PreviewField } from "@payloadcms/plugin-seo/fields";
import {
  createMetaDescriptionField,
  createMetaImageField,
  createMetaTitleField,
} from "@/payload/fields/seo";
import { slugField } from "@/payload/fields/slug";

export const Posts: CollectionConfig<"posts"> = {
  slug: "posts",
  labels: {
    singular: "게시글",
    plural: "게시글",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  defaultSort: "-createdAt",
  admin: {
    components: {
      edit: {
        beforeDocumentControls: ["@/components/DocumentSidebarToggle"],
      },
    },
    defaultColumns: ["title", "slug", "views", "createdAt", "updatedAt"],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === "string" ? data.slug : "",
          collection: "posts",
          req,
        });

        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === "string" ? data.slug : "",
        collection: "posts",
        req,
      }),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "제목",
      required: true,
      unique: true,
      admin: {
        description: "게시글 목록, 브라우저 제목, 공유 카드 생성의 기준입니다.",
        placeholder: "예: Payload Admin을 한국어와 한국 시간으로 설정하기",
      },
      validate: (value) => {
        if (typeof value === "string" && value.trim().length > 0) {
          return true;
        }

        return "게시글에 표시할 제목을 입력하세요.";
      },
    },
    {
      name: "summary",
      type: "textarea",
      label: "요약",
      required: true,
      admin: {
        description:
          "목록과 검색 설명에 사용할 1~2문장 요약입니다. 결론과 대상 독자를 포함하세요.",
        placeholder:
          "예: Payload Admin의 언어와 시간대를 한국 기준으로 통일하는 방법을 설명합니다.",
      },
      validate: (value) => {
        if (typeof value === "string" && value.trim().length > 0) {
          return true;
        }

        return "목록과 검색 결과에 사용할 요약을 입력하세요.";
      },
    },
    {
      name: "views",
      type: "number",
      label: "조회수",
      defaultValue: 0,
      access: {
        create: () => false,
        update: () => false,
      },
      admin: {
        description: "자동 집계되며 직접 수정할 수 없습니다.",
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          fields: [
            {
              name: "heroImage",
              type: "upload",
              label: "대표 이미지",
              relationTo: "media",
              admin: {
                description:
                  "게시글에 연결할 대표 이미지입니다. 검색·공유 카드 이미지는 SEO 탭에서 별도로 지정하세요.",
              },
            },
            {
              name: "content",
              type: "richText",
              label: "본문",
              admin: {
                description:
                  "게시글 제목이 H1입니다. 본문은 H2부터 시작하세요.",
              },
              editor: lexicalEditor({
                admin: {
                  placeholder:
                    "문제, 배경, 접근 방법, 배운 점이 자연스럽게 이어지도록 작성하세요.",
                },
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({
                      enabledHeadingSizes: ["h2", "h3", "h4"],
                    }),
                    StrikethroughFeature(),
                    SubscriptFeature(),
                    SuperscriptFeature(),
                    InlineCodeFeature(),
                    AlignFeature(),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                    ChecklistFeature(),
                    IndentFeature(),
                    BlockquoteFeature(),
                    HorizontalRuleFeature(),
                    LinkFeature({
                      enabledCollections: ["pages", "posts"],
                    }),
                    UploadFeature({
                      collections: {
                        media: {
                          fields: [
                            {
                              name: "caption",
                              type: "text",
                              label: "캡션",
                              admin: {
                                description:
                                  "이미지 출처, 맥락, 추가 설명이 필요할 때 입력하세요.",
                                placeholder:
                                  "예: Payload 공식 문서의 Admin 화면",
                              },
                            },
                            {
                              name: "alt",
                              type: "text",
                              label: "대체 텍스트",
                              required: true,
                              admin: {
                                description:
                                  "이미지를 볼 수 없어도 같은 정보를 이해할 수 있게 핵심 의미를 설명하세요.",
                                placeholder:
                                  "예: 예약 발행 일시를 선택하는 Payload Admin 화면",
                              },
                              validate: (value) => {
                                if (
                                  typeof value === "string" &&
                                  value.trim().length > 0
                                ) {
                                  return true;
                                }

                                return "이미지가 전달하는 핵심 의미를 대체 텍스트로 입력하세요.";
                              },
                            },
                          ],
                        },
                      },
                    }),
                    // Blocks
                    BlocksFeature({
                      blocks: [
                        Banner,
                        MediaBlock,
                        CodeBlock({
                          defaultLanguage: "java",
                          languages: {
                            plaintext: "Plain Text",
                            javascript: "JavaScript",
                            typescript: "TypeScript",
                            tsx: "TSX",
                            jsx: "JSX",
                            python: "Python",
                            java: "Java",
                            kotlin: "Kotlin",
                            groovy: "Groovy",
                            bash: "Bash",
                            yaml: "YAML",
                            css: "CSS",
                            html: "HTML",
                            json: "JSON",
                          },
                        }),
                      ],
                    }),
                    // Toolbars
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ];
                },
              }),
              required: true,
            },
          ],
          label: "콘텐츠",
        },
        {
          fields: [
            {
              name: "relatedPosts",
              type: "relationship",
              label: "관련 글",
              admin: {
                description:
                  "본문을 읽은 뒤 이어서 볼 글을 최대 3개 선택하세요.",
                position: "sidebar",
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                };
              },
              hasMany: true,
              maxRows: 3,
              relationTo: "posts",
            },
          ],
          label: "관련 콘텐츠",
        },
        {
          name: "meta",
          label: "검색·공유 (SEO)",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            createMetaTitleField({
              description: "비워 두면 게시글 제목으로 자동 생성됩니다.",
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
                placeholder: "https://example.com/original-post",
              },
              hooks: {
                beforeChange: [
                  async ({ data, value }) =>
                    !value ? getCollectionURL("posts", data?.slug) : value,
                ],
              },
            },
            createMetaDescriptionField({
              description:
                "비워 두면 요약을 사용합니다. 검색 결과용 문구를 따로 쓸 때만 입력하세요.",
              hasGenerateFn: true,
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
        date: {
          pickerAppearance: "dayAndTime",
        },
        description:
          "비워 두고 발행하면 현재 시각이 기록됩니다. 예약 발행은 별도 예약 기능을 사용하세요.",
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    {
      name: "contentUpdatedAt",
      type: "date",
      label: "콘텐츠 수정일",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        description: "독자에게 의미 있는 본문 변경일이며 자동으로 관리됩니다.",
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "authors",
      type: "relationship",
      label: "작성자",
      admin: {
        description: "공개 바이라인과 구조화 데이터에 표시됩니다.",
        position: "sidebar",
      },
      hasMany: true,
      relationTo: "users",
    },
    {
      name: "categories",
      type: "relationship",
      label: "카테고리",
      admin: {
        description: "가장 관련성이 높은 카테고리만 선택하세요.",
        position: "sidebar",
      },
      hasMany: true,
      relationTo: "categories",
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: "populatedAuthors",
      type: "array",
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
        readOnly: true,
      },
      fields: [
        {
          name: "id",
          type: "text",
        },
        {
          name: "name",
          type: "text",
        },
        {
          name: "bio",
          type: "textarea",
        },
        {
          name: "website",
          type: "text",
        },
        {
          name: "githubUrl",
          type: "text",
        },
        {
          name: "profileImage",
          type: "relationship",
          relationTo: "media",
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
    beforeChange: [setContentUpdatedAt],
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
