import type { Config, Media, Page, Post } from "@/payload-types";

import { getAbsoluteURL, getCollectionURL } from "@/lib/utils/getURL";

const SITE_NAME = "junlog";
const SITE_DESCRIPTION =
  "기술과 개념을 직관적이고, 논리적으로, 그리고 쉽게 이해할 수 있도록 풀어갑니다.";
const SITE_LANGUAGE = "ko-KR";

type SchemaObject = Record<string, unknown>;

const getImageURL = (image?: Media | Config["db"]["defaultIDType"] | null) => {
  const fallbackImageURL = getAbsoluteURL("/junlog-og.webp");

  if (image && typeof image === "object" && "url" in image) {
    const ogUrl = image.sizes?.og?.url;

    return ogUrl
      ? getAbsoluteURL(ogUrl)
      : image.url
        ? getAbsoluteURL(image.url)
        : fallbackImageURL;
  }

  return fallbackImageURL;
};

const getPublisherSchema = (): SchemaObject => ({
  "@type": "Organization",
  name: SITE_NAME,
  url: getAbsoluteURL("/"),
  logo: {
    "@type": "ImageObject",
    url: getAbsoluteURL("/junlog-og.webp"),
  },
});

const getAuthorSameAs = (author: {
  githubUrl?: string | null;
  linkedInUrl?: string | null;
  xUrl?: string | null;
}) =>
  [author.githubUrl, author.linkedInUrl, author.xUrl].filter(
    (value): value is string => Boolean(value)
  );

const getWebsiteReference = (): SchemaObject => ({
  "@type": "WebSite",
  name: SITE_NAME,
  url: getAbsoluteURL("/"),
});

export const getWebSiteSchema = (): SchemaObject => ({
  "@type": "WebSite",
  name: SITE_NAME,
  url: getAbsoluteURL("/"),
  description: SITE_DESCRIPTION,
  inLanguage: SITE_LANGUAGE,
  publisher: getPublisherSchema(),
});

export const getWebPageSchema = ({
  name,
  description,
  url,
}: {
  name: string;
  description?: string;
  url: string;
}): SchemaObject => ({
  "@type": "WebPage",
  name,
  url,
  ...(description ? { description } : {}),
  inLanguage: SITE_LANGUAGE,
  isPartOf: getWebsiteReference(),
});

export const getContactPageSchema = ({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}): SchemaObject => ({
  "@type": "ContactPage",
  name,
  description,
  url,
  inLanguage: SITE_LANGUAGE,
  isPartOf: getWebsiteReference(),
});

export const getCollectionPageSchema = ({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}): SchemaObject => ({
  "@type": "CollectionPage",
  name,
  description,
  url,
  inLanguage: SITE_LANGUAGE,
  isPartOf: getWebsiteReference(),
});

export const getBreadcrumbSchema = (
  items: {
    name: string;
    item: string;
  }[]
): SchemaObject => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.item,
  })),
});

export const getItemListSchema = ({
  name,
  items,
}: {
  name: string;
  items: {
    name: string;
    url: string;
  }[];
}): SchemaObject => ({
  "@type": "ItemList",
  name,
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    url: item.url,
  })),
});

export const getPostSchema = (post: Partial<Post>): SchemaObject => {
  const description = post.meta?.description || post.summary || SITE_DESCRIPTION;
  const canonicalURL =
    post.meta?.canonicalUrl || getCollectionURL("posts", post.slug);
  const authors =
    post.populatedAuthors
      ?.filter((author) => Boolean(author?.name))
      .map((author) => ({
        "@type": "Person",
        name: author.name,
        ...(author.bio
          ? {
              description: author.bio,
            }
          : {}),
        ...(author.website
          ? {
              url: author.website,
            }
          : {}),
        ...(getAuthorSameAs(author).length
          ? {
              sameAs: getAuthorSameAs(author),
            }
          : {}),
        ...(author.profileImage
          ? {
              image: {
                "@type": "ImageObject",
                url: getImageURL(author.profileImage),
              },
            }
          : {}),
      })) || [];
  const categoryNames =
    post.categories
      ?.map((category) =>
        typeof category === "object" ? category.title : undefined
      )
      .filter((value): value is string => Boolean(value)) || [];

  return {
    "@type": "BlogPosting",
    headline: post.title || SITE_NAME,
    name: post.title || SITE_NAME,
    description,
    url: canonicalURL,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalURL,
    },
    image: [
      {
        "@type": "ImageObject",
        url: getImageURL(post.meta?.image),
      },
    ],
    ...(post.publishedAt
      ? {
          datePublished: post.publishedAt,
        }
      : {}),
    ...((post.updatedAt || post.publishedAt) &&
    typeof (post.updatedAt || post.publishedAt) === "string"
      ? {
          dateModified: post.updatedAt || post.publishedAt,
        }
      : {}),
    ...(authors.length
      ? {
          author: authors,
        }
      : {}),
    ...(categoryNames[0]
      ? {
          articleSection: categoryNames[0],
        }
      : {}),
    ...(categoryNames.length
      ? {
          keywords: categoryNames.join(", "),
        }
      : {}),
    publisher: getPublisherSchema(),
    inLanguage: SITE_LANGUAGE,
  };
};

export const getPageSchema = (page: Partial<Page>): SchemaObject => {
  const url = page.meta?.canonicalUrl || getCollectionURL("pages", page.slug);

  return getWebPageSchema({
    name: page.title || SITE_NAME,
    description: page.meta?.description || SITE_DESCRIPTION,
    url,
  });
};
