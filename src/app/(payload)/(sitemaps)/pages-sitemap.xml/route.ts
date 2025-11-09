import { getServerSideSitemap } from "next-sitemap";
import { changefreq } from "next-sitemap.config.cjs";
import { unstable_cache } from "next/cache";

const getPagesSitemap = unstable_cache(
  async () => {
    const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://junlog.com";

    const dateFallback = new Date().toISOString();

    const defaultSitemap = [
      {
        loc: `${SITE_URL}/`,
        lastmod: dateFallback,
        priority: 1.0,
        changefreq: changefreq || "daily",
      },
      {
        loc: `${SITE_URL}/posts`,
        lastmod: dateFallback,
        priority: 0.9,
        changefreq: changefreq || "daily",
      },
      {
        loc: `${SITE_URL}/contact`,
        lastmod: dateFallback,
        priority: 0.2,
        changefreq: changefreq || "yearly",
      },
    ];

    return [...defaultSitemap];
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
