import canUseDOM from "./canUseDOM";

const collectionPrefixMap = {
  pages: "",
  posts: "/posts",
} as const;

const ABSOLUTE_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;

export type RoutableCollection = keyof typeof collectionPrefixMap;

const normalizeSlug = (slug?: string | null) =>
  (slug || "").trim().replace(/^\/+|\/+$/g, "");

export const isAbsoluteURL = (value?: string | null) =>
  ABSOLUTE_URL_PATTERN.test((value || "").trim());

const normalizePath = (path?: string | null) => {
  const normalizedPath = (path || "").trim();

  if (!normalizedPath || normalizedPath === "/") {
    return "/";
  }

  if (isAbsoluteURL(normalizedPath)) {
    return normalizedPath;
  }

  return `/${normalizedPath.replace(/^\/+|\/+$/g, "")}`;
};

/**
 * Utility functions for getting the application's URL in different environments.
 * These functions help maintain consistent URL generation across server and client contexts.
 */

/**
 * Gets the application URL when running on the server.
 *
 * @returns {string} The server-side URL of the application
 *
 * ## When to use:
 *
 * 1. **Server Components**:
 *    - When generating absolute URLs in Server Components
 *    - For creating canonical URLs for SEO
 *
 * 2. **API Routes**:
 *    - When constructing callback URLs for authentication flows
 *    - For webhook response URLs
 *
 * 3. **Email Templates**:
 *    - When including application links in emails
 */
export const getServerSideURL = () => {
  let url = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (!url) {
    url = "http://localhost:3000";
  }

  return url;
};

export const getAbsoluteURL = (path?: string | null) => {
  return new URL(normalizePath(path), getServerSideURL()).toString();
};

export const getCollectionPath = (
  collection: RoutableCollection,
  slug?: string | null
) => {
  const normalizedSlug = normalizeSlug(slug);

  if (collection === "pages") {
    if (!normalizedSlug || normalizedSlug === "home") {
      return "/";
    }

    return normalizePath(normalizedSlug);
  }

  return normalizedSlug
    ? `${collectionPrefixMap[collection]}/${normalizedSlug}`
    : collectionPrefixMap[collection];
};

export const getCollectionURL = (
  collection: RoutableCollection,
  slug?: string | null
) => {
  return getAbsoluteURL(getCollectionPath(collection, slug));
};

/**
 * Gets the application URL when running in the browser.
 * Falls back to server-side detection when not in browser.
 *
 * @returns {string} The client-side URL of the application
 *
 * ## When to use:
 *
 * 1. **Client Components**:
 *    - When generating absolute URLs in Client Components
 *    - For sharing links or social media integration
 *
 * 2. **Dynamic Redirects**:
 *    - When constructing redirect URLs based on current location
 *
 * 3. **Cross-Origin Requests**:
 *    - When making API calls that need the current origin
 */
export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol;
    const domain = window.location.hostname;
    const port = window.location.port;

    return `${protocol}//${domain}${port ? `:${port}` : ""}`;
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || "";
};
