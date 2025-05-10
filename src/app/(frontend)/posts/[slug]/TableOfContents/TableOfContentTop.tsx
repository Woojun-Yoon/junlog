import Link from "next/link";

import { HeadingItem } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  toc: HeadingItem[];
}

const TableOfContentTop = ({ toc }: Props) => {
  if (toc.length === 0) return null;

  return (
    <nav className="xl:hidden mt-8 mb-12 px-4 py-4 border rounded-lg bg-muted/30">
      <h2
        id="table-of-contents-top"
        className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4"
      >
        On this page
      </h2>
      <ul className="space-y-1 border-l pl-4">
        {toc.map((item) => (
          <li
            key={item.link}
            className={cn(
              item.indent === 1 && "ml-4",
              "py-1 text-sm text-muted-foreground hover:text-blue-400 transition-colors break-words line-clamp-1 overflow-x-hidden"
            )}
          >
            <Link
              href={item.link}
              className="block underline-offset-4 hover:underline"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContentTop;
