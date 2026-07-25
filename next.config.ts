import { withPayload } from "@payloadcms/next/withPayload";

import redirects from "./redirects.js";
import { NextConfig } from "next";

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item);

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(":", "") as "http" | "https",
        };
      }),
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  redirects,
};

const payloadConfig = withPayload(nextConfig);
const payloadHeaders = payloadConfig.headers;
const colorSchemeClientHint = "sec-ch-prefers-color-scheme";
const clientHintHeaderNames = new Set(["accept-ch", "critical-ch", "vary"]);

const config: NextConfig = {
  ...payloadConfig,
  async headers() {
    const headerRules = (await payloadHeaders?.()) ?? [];

    return headerRules
      .map((rule) => ({
        ...rule,
        headers: rule.headers.flatMap((header) => {
          if (!clientHintHeaderNames.has(header.key.toLowerCase())) {
            return [header];
          }

          const value = header.value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.toLowerCase() !== colorSchemeClientHint)
            .join(", ");

          return value ? [{ ...header, value }] : [];
        }),
      }))
      .filter((rule) => rule.headers.length > 0);
  },
};

export default config;
