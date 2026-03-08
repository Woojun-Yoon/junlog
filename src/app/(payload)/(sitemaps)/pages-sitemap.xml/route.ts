import { getServerSideSitemap } from "next-sitemap";
import { changefreq } from "next-sitemap.config.cjs";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { getAbsoluteURL, getCollectionURL } from "@/lib/utils/getURL";

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config });

    const dateFallback = new Date().toISOString();
    const defaultSitemap = [
      {
        loc: getAbsoluteURL("/"),
        lastmod: dateFallback,
        priority: 1.0,
        changefreq: changefreq || "daily",
      },
      {
        loc: getCollectionURL("posts"),
        lastmod: dateFallback,
        priority: 0.9,
        changefreq: changefreq || "daily",
      },
      {
        loc: getAbsoluteURL("/contact"),
        lastmod: dateFallback,
        priority: 0.2,
        changefreq: changefreq || "yearly",
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
        lastmod: page.updatedAt || dateFallback,
        priority: 0.7,
        changefreq: changefreq || "weekly",
      }));

    const categoryPages = categories.docs
      .filter((category) => Boolean(category.slug))
      .map((category) => ({
        loc: getAbsoluteURL(`/posts/category/${category.slug}`),
        lastmod: category.updatedAt || dateFallback,
        priority: 0.6,
        changefreq: changefreq || "weekly",
      }));

    const uniqueEntries = [
      ...defaultSitemap,
      ...dynamicPages,
      ...categoryPages,
    ].filter(
      (entry, index, entries) =>
        entries.findIndex((candidate) => candidate.loc === entry.loc) === index
    );

    return uniqueEntries;
  },
  ["pages-sitemap"],
  {
    tags: ["pages-sitemap"],
  }
);

export async function GET() {
  const sitemap = await getPagesSitemap();

  return getServerSideSitemap(sitemap);
}
