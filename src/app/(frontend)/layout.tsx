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
import Script from "next/script";

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
          <Script
            src="https://app.rybbit.io/api/script.js"
            data-site-id="9fc21c7115dc"
            strategy="afterInteractive"
          />
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
