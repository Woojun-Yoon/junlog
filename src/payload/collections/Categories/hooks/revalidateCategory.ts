import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

import { revalidatePath, revalidateTag } from "next/cache";

import type { Category } from "@/payload-types";

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = doc.slug ? `/posts/category/${doc.slug}` : "/posts";

    payload.logger.info(`Revalidating category at path: ${path}`);

    revalidatePath("/posts");
    revalidatePath(path);
    revalidateTag("pages-sitemap");

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = `/posts/category/${previousDoc.slug}`;

      payload.logger.info(`Revalidating old category at path: ${oldPath}`);

      revalidatePath(oldPath);
    }
  }

  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Category> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath("/posts");

    if (doc?.slug) {
      revalidatePath(`/posts/category/${doc.slug}`);
    }

    revalidateTag("pages-sitemap");
  }

  return doc;
};
