import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { Plugin } from "payload";

import { getCollectionURL, getServerSideURL, RoutableCollection } from "@/lib/utils/getURL";
import { Page, Post } from "@/payload-types";
import { revalidateRedirects } from "../hooks/revalidateRedirects";

const isRoutableCollection = (
  collectionSlug?: string
): collectionSlug is RoutableCollection => {
  return collectionSlug === "pages" || collectionSlug === "posts";
};

export const plugins: Plugin[] = [
  // storage-adapter-placeholder,

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
    generateTitle: ({ doc }: { doc: Post | Page }) => {
      return doc?.title
        ? `${doc.title} | junlog`
        : "junlog";
    },
    generateDescription: ({ doc }: { doc: Post | Page }) => {
      if ("summary" in doc && typeof doc.summary === "string") {
        return doc.summary;
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
