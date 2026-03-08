import type { Metadata } from "next";

import React from "react";
import { Pretendard } from "./font";

import { Footer } from "@/payload/globals/Footer/Component";
import { Header } from "@/payload/globals/Header/Component";
import { InitTheme } from "@/components/ThemeProvider/Theme/InitTheme";
import { mergeOpenGraph } from "@/lib/utils/mergeOpenGraph";

import { getServerSideURL } from "@/lib/utils/getURL";
import "./globals.css";
import { Providers } from "./providers";
import InitFavicon from "@/components/ThemeProvider/Theme/InitFavicon";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${Pretendard.className}`}
      lang="ko"
      suppressHydrationWarning
    >
      <head>
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        />
        <meta
          name="google-adsense-account"
          content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}
        />
        <meta
          name="naver-site-verification"
          content={process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION}
        />
        <InitTheme />
        <InitFavicon />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: "junlog",
  description:
    "기술과 개념을 직관적이고, 논리적으로, 그리고 쉽게 이해할 수 있도록 풀어갑니다.",
  openGraph: mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "junlog",
  },
};
