import { getPayload } from "payload";
import configPromise from "@payload-config";
import RSS from "rss";
import { Category, User } from "@/payload-types";
import { getServerSideURL } from "@/lib/utils/getURL";

export const revalidate = 86400;

const payload = await getPayload({ config: configPromise });
export async function GET() {
  const feedXml = await generateRssFeed();
  if (feedXml) {
    return new Response(feedXml, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
      },
    });
  } else {
    return new Response("Error generating RSS feed.");
  }
}

const generateRssFeed = async () => {
  const url = getServerSideURL();

  const posts = await payload.find({
    collection: "posts",
  });

  try {
    const feed = new RSS({
      title: `junlog`,
      description: `기술과 개념을 직관적이고, 논리적으로, 그리고 쉽게 이해할 수 있도록 풀어갑니다.`,
      generater: `next-payload`,
      feed_url: `${url}/feed.xml`,
      site_url: `${url}`,
      image_url: `${getServerSideURL()}/junlog-og.webp`,
      language: `ko-KR`,
      copyright: `Copyright ${new Date().getFullYear().toString()}`,
      pubDate: new Date().toUTCString(),
      ttl: 60,
    });

    posts.docs.map(
      ({ title, slug, content, publishedAt, authors, categories }) => {
        feed.item({
          title: `${title}`,
          guid: `${url}/posts/${slug}`,
          url: `${url}/posts/${slug}`,
          description: content?.description || "",
          date: new Date(publishedAt || ``),
          author: authors?.map((author: User) => author.name).join(", "),
          categories:
            categories?.map((category: Category) => category.title) || [],
        });
      }
    );

    return feed.xml({ indent: true });
  } catch (error) {
    return null;
  }
};
