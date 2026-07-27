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

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import { slugField } from "@/payload/fields/slug";

export const Posts: CollectionConfig<"posts"> = {
  slug: "posts",
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
      required: true,
      unique: true,
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
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
              relationTo: "media",
            },
            {
              name: "content",
              type: "richText",
              admin: {
                description:
                  "게시글 제목이 H1입니다. 본문은 H2부터 시작하세요.",
              },
              editor: lexicalEditor({
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
                              label: "Caption",
                            },
                            {
                              name: "alt",
                              type: "text",
                              label: "Alt Text",
                              required: true,
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
              label: false,
              required: true,
            },
          ],
          label: "Content",
        },
        {
          fields: [
            {
              name: "relatedPosts",
              type: "relationship",
              admin: {
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
              relationTo: "posts",
            },
          ],
          label: "Meta",
        },
        {
          name: "meta",
          label: "SEO",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: "media",
            }),
            {
              type: "text",
              name: "canonicalUrl",
              label: "Canonical URL",
              hooks: {
                beforeChange: [
                  async ({ data, value }) =>
                    !value ? getCollectionURL("posts", data?.slug) : value,
                ],
              },
            },
            MetaDescriptionField({}),
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
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
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
      label: "Content updated at",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "authors",
      type: "relationship",
      admin: {
        position: "sidebar",
      },
      hasMany: true,
      relationTo: "users",
    },
    {
      name: "categories",
      type: "relationship",
      admin: {
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
        disabled: true,
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
