import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

import { revalidatePath, revalidateTag } from "next/cache";

import type { Category } from "@/payload-types";

const getCategoryPath = (slug?: string | null) =>
  slug ? `/posts/category/${slug}` : null;

const revalidateCategoryListings = () => {
  revalidatePath("/posts");
  revalidatePath("/posts/page/[pageNumber]", "page");
  revalidatePath("/posts/category/[categorySlug]", "page");
  revalidatePath("/posts/category/[categorySlug]/page/[pageNumber]", "page");
};

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc;
  }

  const path = getCategoryPath(doc.slug);
  const oldPath = getCategoryPath(previousDoc?.slug);

  if (path) {
    payload.logger.info(`Revalidating category at path: ${path}`);
    revalidatePath(path);
  }

  if (oldPath && oldPath !== path) {
    payload.logger.info(`Revalidating old category at path: ${oldPath}`);
    revalidatePath(oldPath);
  }

  payload.logger.info("Revalidating category listings");
  revalidateCategoryListings();
  revalidateTag("pages-sitemap");

  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Category> = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc;
  }

  if (doc?.slug) {
    const path = getCategoryPath(doc.slug);

    if (path) {
      payload.logger.info(`Revalidating deleted category at path: ${path}`);
      revalidatePath(path);
    }
  }

  payload.logger.info("Revalidating category listings");
  revalidateCategoryListings();
  revalidateTag("pages-sitemap");

  return doc;
};
