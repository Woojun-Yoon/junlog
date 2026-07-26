const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://junlog.com";

const PRIVATE_PATHS = ["/admin", "/admin/*", "/api/*"];

// Search/index crawlers that can surface and cite public content in AI answers.
const AI_SEARCH_CRAWLERS = [
  "Googlebot",
  "bingbot",
  "OAI-SearchBot",
  "PerplexityBot",
  "Claude-SearchBot",
  "DuckAssistBot",
  "MistralAI-Index",
  "YouBot",
  "Applebot",
];

// Fetchers that retrieve public content in response to a user or agent request.
const AI_USER_FETCHERS = [
  "ChatGPT-User",
  "Perplexity-User",
  "Claude-User",
  "MistralAI-User",
  "meta-externalfetcher",
  "Google-Agent",
  "Google-GeminiNotebook",
  "Google-NotebookLM",
  "GoogleAgent-Mariner",
  "GoogleAgent-Shopping",
  "Google-CloudVertexBot",
  "Gemini-Deep-Research",
  "Copilot",
  "facebookexternalhit",
];

// Training and dataset crawlers are controlled independently from AI search.
const AI_TRAINING_CRAWLERS = [
  "GPTBot",
  "CCBot",
  "Google-Extended",
  "ClaudeBot",
  "meta-externalagent",
  "FacebookBot",
  "Bytespider",
  "omgili",
  "AI2Bot",
  "Ai2Bot-Dolma",
  "PanguBot",
  "cohere-ai",
  "img2dataset",
  "VelenPublicWebCrawler",
  "anthropic-ai",
  "Amazonbot",
  "Applebot-Extended",
];

// Other automated collectors remain blocked because they do not support the
// intended AI search or user-request visibility policy.
const OTHER_BLOCKED_CRAWLERS = [
  "EtaoSpider",
  "Scrapy",
  "PetalBot",
  "Devin",
  "Diffbot",
  "Sidetrade indexer bot",
  "iaskspider",
  "wpbot",
  "aiHitBot",
  "FriendlyCrawler",
  "Brightbot",
  "ISSCyberRiskCrawler",
];

const allowPublicContent = (userAgent) => ({
  userAgent,
  allow: "/",
  disallow: PRIVATE_PATHS,
});

const blockAllContent = (userAgent) => ({
  userAgent,
  disallow: "/",
});

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    "/posts-sitemap.xml",
    "/pages-sitemap.xml",
    "/*",
    "/posts/*",
    "/admin",
    "/admin/*",
    "/api/*",
  ],
  robotsTxtOptions: {
    policies: [
      allowPublicContent("*"),
      ...AI_SEARCH_CRAWLERS.map(allowPublicContent),
      ...AI_USER_FETCHERS.map(allowPublicContent),
      ...AI_TRAINING_CRAWLERS.map(blockAllContent),
      ...OTHER_BLOCKED_CRAWLERS.map(blockAllContent),
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
    ],
    transformRobotsTxt: async (_, robotsTxt) => {
      const robotsTxtHeader = `
# ╔═══════════════════════════════════════════════════════════════╗
# ║                                                               ║
# ║         ██╗██╗   ██╗███╗   ██╗██╗      ██████╗  ██████╗       ║
# ║         ██║██║   ██║████╗  ██║██║     ██╔═══██╗██╔════╝       ║
# ║         ██║██║   ██║██╔██╗ ██║██║     ██║   ██║██║  ███╗      ║
# ║    ██   ██║██║   ██║██║╚██╗██║██║     ██║   ██║██║   ██║      ║
# ║    ╚█████╔╝╚██████╔╝██║ ╚████║███████╗╚██████╔╝╚██████╔╝      ║
# ║     ╚════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝  ╚═════╝       ║
# ║                                                               ║
# ║                  Welcome, fellow robots!                      ║
# ║                                                               ║
# ║  Looking for something interesting to crawl?                  ║
# ║  Check out my blog posts about development, tech, and life.   ║
# ║                                                               ║
# ║  If you're a human reading this... why?                       ║
# ║  Visit https://junlog.com instead!                            ║
# ║                                                               ║
# ╚═══════════════════════════════════════════════════════════════╝


`;
      return robotsTxtHeader + robotsTxt;
    },
  },
};
