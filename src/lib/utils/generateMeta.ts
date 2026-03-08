import type { Metadata } from "next";

import type { Media, Page, Post, Config } from "@/payload-types";

import { mergeOpenGraph } from "./mergeOpenGraph";
import { getAbsoluteURL, getCollectionURL, RoutableCollection } from "./getURL";

/**
 * Helper function to get the appropriate image URL for OpenGraph metadata.
 * Prioritizes the OG-sized image if available, falls back to the original image URL,
 * and uses a default image if none is provided.
 *
 * @param {Media | Config['db']['defaultIDType'] | null | undefined} image - The image object or ID
 * @returns {string} The full URL to the image
 */
const getImageURL = (image?: Media | Config["db"]["defaultIDType"] | null) => {
  let url = getAbsoluteURL("/junlog-og.webp");

  if (image && typeof image === "object" && "url" in image) {
    const ogUrl = image.sizes?.og?.url;

    url = ogUrl ? getAbsoluteURL(ogUrl) : getAbsoluteURL(image.url);
  }

  return url;
};

/**
 * Generates standardized metadata for Next.js pages based on Payload CMS document data.
 *
 * @param {Object} args - Arguments object
 * @param {Partial<Page> | Partial<Post>} args.doc - The Payload document to generate metadata from
 * @returns {Promise<Metadata>} Next.js Metadata object
 *
 * ## When to use:
 *
 * 1. **Page Metadata Generation**:
 *    - In generateMetadata functions for Next.js pages
 *    - For consistent metadata across content-driven pages
 *
 * 2. **SEO Optimization**:
 *    - When implementing SEO best practices for content pages
 *    - For ensuring proper title, description, and OpenGraph data
 *
 * 3. **Dynamic Routes**:
 *    - In [slug] or dynamic route handlers
 *    - For blog posts, product pages, or other content-driven pages
 *
 * 4. **Content Preview**:
 *    - When generating metadata for content preview pages
 *    - For draft content that needs proper metadata
 *
 * ## Example usage:
 *
 * ```tsx
 * // In a dynamic [slug] page.tsx
 * import { generateMeta } from '@/lib/utils/generateMeta';
 * import { getCachedDocument } from '@/lib/utils/getDocument';
 *
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const post = await getCachedDocument('posts', params.slug);
 *
 *   if (!post) {
 *     return {
 *       title: 'Post Not Found',
 *     };
 *   }
 *
 *   return generateMeta({ doc: post });
 * }
 *
 * export default async function PostPage({ params }) {
 *   // Page component implementation
 * }
 * ```
 */
export const generateMeta = async (args: {
  collection: RoutableCollection;
  doc: Partial<Page> | Partial<Post> | null;
}): Promise<Metadata> => {
  const { collection, doc } = args || {};

  if (!doc) {
    return {
      title: "junlog",
      openGraph: mergeOpenGraph(),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const ogImage = getImageURL(doc?.meta?.image);
  const fallbackDescription =
    "summary" in doc && typeof doc.summary === "string" ? doc.summary : undefined;
  const description = doc?.meta?.description || fallbackDescription;
  const canonicalURL =
    doc?.meta?.canonicalUrl || getCollectionURL(collection, doc?.slug);
  const pageTitle = doc?.meta?.title || doc?.title || "junlog";
  const title = pageTitle === "junlog" ? pageTitle : `${pageTitle} | junlog`;

  const openGraph = mergeOpenGraph({
    title,
    type: collection === "posts" ? "article" : "website",
    url: canonicalURL,
    images: ogImage
      ? [
          {
            url: ogImage,
          },
        ]
      : undefined,
    ...(description ? { description } : {}),
    ...(collection === "posts" &&
    "publishedAt" in doc &&
    typeof doc.publishedAt === "string"
      ? {
          publishedTime: doc.publishedAt,
        }
      : {}),
    ...(collection === "posts" &&
    "updatedAt" in doc &&
    typeof doc.updatedAt === "string"
      ? {
          modifiedTime: doc.updatedAt,
        }
      : {}),
  });

  return {
    title,
    ...(description ? { description } : {}),
    openGraph,
    alternates: {
      canonical: canonicalURL,
    },
  };
};
