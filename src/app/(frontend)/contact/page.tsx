import type { Metadata } from "next";
import ContactPage from "./page.client";
import { JsonLd } from "@/components/Seo/JsonLd";
import { mergeOpenGraph } from "@/lib/utils/mergeOpenGraph";
import { getAbsoluteURL } from "@/lib/utils/getURL";
import { getBreadcrumbSchema, getContactPageSchema } from "@/lib/seo/schema";

export default function Page() {
  const canonicalURL = getAbsoluteURL("/contact");

  return (
    <>
      <JsonLd
        schema={[
          getContactPageSchema({
            name: "Contact | junlog",
            description: "Contact me for any inquiries or feedback.",
            url: canonicalURL,
          }),
          getBreadcrumbSchema([
            {
              name: "Home",
              item: getAbsoluteURL("/"),
            },
            {
              name: "Contact",
              item: canonicalURL,
            },
          ]),
        ]}
      />
      <ContactPage />
    </>
  );
}

export const metadata: Metadata = {
  title: "Contact | junlog",
  description: "Contact me for any inquiries or feedback.",
  openGraph: mergeOpenGraph({
    title: "Contact | junlog",
    description: "Contact me for any inquiries or feedback.",
    url: getAbsoluteURL("/contact"),
  }),
  alternates: {
    canonical: getAbsoluteURL("/contact"),
  },
};
