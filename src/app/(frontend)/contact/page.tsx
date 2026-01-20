import type { Metadata } from "next";
import ContactPage from "./page.client";

export default function Page() {
  return <ContactPage />;
}

export const metadata: Metadata = {
  title: "Contact Me",
  description: "Contact me for any inquiries or feedback.",
  openGraph: {
    title: "Contact Me",
    description: "Contact me for any inquiries or feedback.",
    url: "https://junlog.com/contact",
  },
  alternates: {
    canonical: "https://junlog.com/contact",
  },
};
