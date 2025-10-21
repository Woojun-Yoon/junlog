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
      lang="en"
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
  openGraph: mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "junlog",
  },
};
