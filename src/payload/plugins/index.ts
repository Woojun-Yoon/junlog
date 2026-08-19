import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { searchPlugin } from "@payloadcms/plugin-search";
import { seoPlugin } from "@payloadcms/plugin-seo";
import type { Plugin } from "payload";

import {
  getCollectionURL,
  getServerSideURL,
  RoutableCollection,
} from "@/lib/utils/getURL";
import { Page, Post } from "@/payload-types";
import { revalidateRedirects } from "../hooks/revalidateRedirects";
import { extractSearchHeadings } from "./search/extractSearchHeadings";

const isRoutableCollection = (
  collectionSlug?: string,
): collectionSlug is RoutableCollection => {
  return collectionSlug === "pages" || collectionSlug === "posts";
};

export const plugins: Plugin[] = [
  // storage-adapter-placeholder,

  searchPlugin({
    collections: ["posts"],
    beforeSync: ({ originalDoc, searchDoc }) => {
      return {
        ...searchDoc,
        headings: extractSearchHeadings(originalDoc.content),
        slug: typeof originalDoc.slug === "string" ? originalDoc.slug : "",
        summary:
          typeof originalDoc.summary === "string" ? originalDoc.summary : "",
      };
    },
    searchOverrides: {
      labels: {
        singular: "검색 인덱스",
        plural: "검색 인덱스",
      },
      admin: {
        description:
          "공개 게시글의 제목, 요약, H2~H4 소제목으로 자동 생성되는 검색 인덱스입니다.",
      },
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: "summary",
          type: "textarea",
          label: "요약",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "headings",
          type: "textarea",
          label: "본문 소제목 (H2~H4)",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "slug",
          type: "text",
          label: "Slug",
          index: true,
          required: true,
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    skipSync: ({ doc }) =>
      typeof doc.slug !== "string" || doc.slug.trim().length === 0,
    syncDrafts: false,
  }),

  redirectsPlugin({
    collections: ["pages", "posts"],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ("name" in field && field.name === "from") {
            return {
              ...field,
              admin: {
                description:
                  "You will need to rebuild the website when changing this field.",
              },
            };
          }
          return field;
        });
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),

  seoPlugin({
    generateTitle: ({
      collectionConfig,
      doc,
    }: {
      collectionConfig?: { slug?: string };
      doc: Post | Page;
    }) => {
      if (!doc?.title) {
        return "junlog";
      }

      return collectionConfig?.slug === "posts"
        ? doc.title
        : `${doc.title} | junlog`;
    },
    generateDescription: ({ doc }: { doc: Post | Page }) => {
      if ("summary" in doc && typeof doc.summary === "string") {
        return doc.summary;
      }

      return "";
    },
    generateImage: ({ doc }: { doc: Post | Page }) => {
      if ("heroImage" in doc) {
        return doc.heroImage || "";
      }

      return "";
    },
    generateURL: ({
      collectionConfig,
      doc,
    }: {
      collectionConfig?: { slug?: string };
      doc: Post | Page;
    }) => {
      if (isRoutableCollection(collectionConfig?.slug)) {
        return getCollectionURL(collectionConfig.slug, doc?.slug);
      }

      return getServerSideURL();
    },
  }),

  payloadCloudPlugin(),
];
