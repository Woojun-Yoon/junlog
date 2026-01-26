import type { Metadata } from "next/types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import PageClient from "./page.client";
import { Category } from "@/payload-types";
import { PostsPageLayout } from "../../_components/PostsPageLayout";

export const dynamic = "force-static";
export const revalidate = 600;
const POSTS_SIZE = 12;

type Args = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { categorySlug } = await paramsPromise;
  const payload = await getPayload({ config: configPromise });

  // Get all categories for the filter
  const categoriesResult = await payload.find({
    collection: "categories",
    limit: 100,
    overrideAccess: false,
    sort: "title",
  });

  // Find the current category
  const currentCategory = categoriesResult.docs.find(
    (cat) => cat.slug === categorySlug,
  );

  if (!currentCategory) {
    notFound();
  }

  // Get posts filtered by category
  const posts = await payload.find({
    collection: "posts",
    depth: 1,
    limit: POSTS_SIZE,
    overrideAccess: false,
    sort: "-publishedAt",
    where: {
      categories: {
        contains: currentCategory.id,
      },
    },
  });

  return (
    <>
      <PageClient />
      <PostsPageLayout
        categories={categoriesResult.docs}
        posts={posts.docs}
        activeCategory={categorySlug}
        currentCategoryTitle={currentCategory.title}
        totalDocs={posts.totalDocs}
        page={posts.page || 1}
        totalPages={posts.totalPages}
      />
    </>
  );
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const categories = await payload.find({
    collection: "categories",
    limit: 100,
    overrideAccess: false,
  });

  return categories.docs
    .filter((cat): cat is Category & { slug: string } => !!cat.slug)
    .map((cat) => ({
      categorySlug: cat.slug,
    }));
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { categorySlug } = await paramsPromise;
  const payload = await getPayload({ config: configPromise });

  const categoriesResult = await payload.find({
    collection: "categories",
    where: {
      slug: { equals: categorySlug },
    },
    limit: 1,
  });

  const category = categoriesResult.docs[0];
  const title = category?.title || categorySlug;

  return {
    title: `${title} - Junlog Posts`,
    description: `${title} 카테고리의 게시물 목록`,
    openGraph: {
      title: `${title} - Junlog Posts`,
      description: `${title} 카테고리의 게시물 목록`,
      url: `https://junlog.com/posts/category/${categorySlug}`,
    },
    alternates: {
      canonical: `https://junlog.com/posts/category/${categorySlug}`,
    },
  };
}
