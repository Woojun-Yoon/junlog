import type { Metadata } from "next";
import ContactPage from "./page.client";

export const metadata: Metadata = {
  title: "Contact Me",
  description: "Contact me for any inquiries or feedback.",
};

export default function Page() {
  return <ContactPage />;
}