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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const basePath = process.env.BASE_PATH || "";

  return (
    <html
      className={`${Pretendard.className}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`${basePath}/favicons/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/favicons/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/favicons/favicon-16x16.png`}
        />
        <link rel="manifest" href={`${basePath}/favicons/site.webmanifest`} />
        <link
          rel="mask-icon"
          href={`${basePath}/favicons/safari-pinned-tab.svg`}
          color="#5bbad5"
        />
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
