const SEARCH_HEADING_TAGS = new Set(["h2", "h3", "h4"]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getLexicalNodeText = (node: unknown): string => {
  if (!isRecord(node)) {
    return "";
  }

  if (typeof node.text === "string") {
    return node.text;
  }

  return Array.isArray(node.children)
    ? node.children.map(getLexicalNodeText).join("")
    : "";
};

export const extractSearchHeadings = (content: unknown): string => {
  const headings: string[] = [];

  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }

    if (!isRecord(node)) {
      return;
    }

    if (
      node.type === "heading" &&
      typeof node.tag === "string" &&
      SEARCH_HEADING_TAGS.has(node.tag)
    ) {
      const heading = getLexicalNodeText(node).replace(/\s+/g, " ").trim();

      if (heading) {
        headings.push(heading);
      }
    }

    if (isRecord(node.root)) {
      visit(node.root);
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(visit);
    }
  };

  visit(content);

  return headings.join("\n");
};
