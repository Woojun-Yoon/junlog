import { getServerSideSitemap } from "next-sitemap";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { getAbsoluteURL, getCollectionURL } from "@/lib/utils/getURL";

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config });

    const defaultSitemap = [
      {
        loc: getAbsoluteURL("/"),
      },
      {
        loc: getCollectionURL("posts"),
      },
      {
        loc: getAbsoluteURL("/contact"),
      },
    ];

    const [pages, categories] = await Promise.all([
      payload.find({
        collection: "pages",
        overrideAccess: false,
        draft: false,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: "published",
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: "categories",
        overrideAccess: false,
        limit: 1000,
        pagination: false,
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    ]);

    const dynamicPages = pages.docs
      .filter((page) => Boolean(page.slug) && page.slug !== "home")
      .map((page) => ({
        loc: getCollectionURL("pages", page.slug),
        lastmod: page.updatedAt,
      }));

    const categoryPages = categories.docs
      .filter((category) => Boolean(category.slug))
      .map((category) => ({
        loc: getAbsoluteURL(`/posts/category/${category.slug}`),
        lastmod: category.updatedAt,
      }));

    const uniqueEntries = [
      ...defaultSitemap,
      ...dynamicPages,
      ...categoryPages,
    ].filter(
      (entry, index, entries) =>
        entries.findIndex((candidate) => candidate.loc === entry.loc) === index,
    );

    return uniqueEntries;
  },
  ["pages-sitemap"],
  {
    tags: ["pages-sitemap"],
  },
);

export async function GET() {
  const sitemap = await getPagesSitemap();

  return getServerSideSitemap(sitemap);
}
