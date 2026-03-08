import type { Metadata } from "next/types";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import PageClient from "./page.client";
import { JsonLd } from "@/components/Seo/JsonLd";
import { Category } from "@/payload-types";
import { PostsPageLayout } from "../../_components/PostsPageLayout";
import { mergeOpenGraph } from "@/lib/utils/mergeOpenGraph";
import { getAbsoluteURL } from "@/lib/utils/getURL";
import {
  getBreadcrumbSchema,
  getCollectionPageSchema,
  getItemListSchema,
} from "@/lib/seo/schema";

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

  const canonicalURL = getAbsoluteURL(`/posts/category/${categorySlug}`);
  const schemas = [
    getCollectionPageSchema({
      name: `${currentCategory.title} Posts`,
      description: `${currentCategory.title} 카테고리의 게시물 목록`,
      url: canonicalURL,
    }),
    getBreadcrumbSchema([
      {
        name: "Home",
        item: getAbsoluteURL("/"),
      },
      {
        name: "Posts",
        item: getAbsoluteURL("/posts"),
      },
      {
        name: currentCategory.title,
        item: canonicalURL,
      },
    ]),
  ];
  const categoryItems = posts.docs
    .filter((post) => Boolean(post.slug) && Boolean(post.title))
    .map((post) => ({
      name: post.title,
      url: getAbsoluteURL(`/posts/${post.slug}`),
    }));

  if (categoryItems.length > 0) {
    schemas.push(
      getItemListSchema({
        name: `${currentCategory.title} Posts`,
        items: categoryItems,
      })
    );
  }

  return (
    <>
      <JsonLd schema={schemas} />
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
  const metaTitle = `${title} Posts | junlog`;
  const canonicalURL = getAbsoluteURL(`/posts/category/${categorySlug}`);

  return {
    title: metaTitle,
    description: `${title} 카테고리의 게시물 목록`,
    openGraph: mergeOpenGraph({
      title: metaTitle,
      description: `${title} 카테고리의 게시물 목록`,
      url: canonicalURL,
    }),
    alternates: {
      canonical: canonicalURL,
    },
  };
}
