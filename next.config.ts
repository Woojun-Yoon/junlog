import { withPayload } from "@payloadcms/next/withPayload";

import redirects from "./redirects.js";
import { NextConfig } from "next";

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const basePath = process.env.BASE_PATH || undefined;

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item);

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(":", "") as "http" | "https",
        };
      }),
    ],
  },
  reactStrictMode: true,
  basePath,
  redirects,
};

export default withPayload(nextConfig);
