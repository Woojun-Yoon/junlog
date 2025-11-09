import { FooterClient } from "./Component.client";
import { getCachedGlobal } from "@/lib/utils/getGlobals";
import React from "react";

import type { Footer } from "@/payload-types";

export async function Footer() {
  const footerData: Footer = (await getCachedGlobal("footer", 1)()) as Footer;

  return <FooterClient data={footerData} />;
}
