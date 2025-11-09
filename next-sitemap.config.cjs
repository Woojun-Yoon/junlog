const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://junlog.com";

const AI_CRAWLERS = [
  "EtaoSpider",
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleAgent-Mariner",
  "GoogleAgent-Shopping",
  "Google-CloudVertexBot",
  "Google-NotebookLM",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "meta-externalagent",
  "meta-externalfetcher",
  "FacebookBot",
  "Bytespider",
  "Scrapy",
  "PetalBot",
  "Devin",
  "omgili",
  "AI2Bot",
  "Ai2Bot-Dolma",
  "Gemini-Deep-Research",
  "PanguBot",
  "MistralAI-User",
  "Diffbot",
  "Sidetrade indexer bot",
  "DuckAssistBot",
  "Copilot",
  "iaskspider",
  "wpbot",
  "aiHitBot",
  "cohere-ai",
  "FriendlyCrawler",
  "img2dataset",
  "VelenPublicWebCrawler",
  "YouBot",
  "Brightbot",
  "ISSCyberRiskCrawler",
  "anthropic-ai",
  "Amazonbot",
  "Applebot-Extended",
  "facebookexternalhit",
];

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
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
      ...AI_CRAWLERS.map((bot) => ({
        userAgent: bot,
        disallow: "/",
      })),
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
