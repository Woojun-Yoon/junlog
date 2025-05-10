import { HeadingItem } from "./types";

export const parseToc = (headings: [string, string][]): HeadingItem[] => {
  return headings.map(([text, tag]) => {
    const level = parseInt(tag.replace("h", ""), 10);
    return {
      text,
      link:
        "#" +
        text
          .trim()
          .replace(/[\[\]:!@#$/%^&*()+=,.?]/g, "")
          .replace(/\s+/g, "-")
          .toLowerCase(),
      indent: Math.max(0, level - 2),
    };
  });
};
