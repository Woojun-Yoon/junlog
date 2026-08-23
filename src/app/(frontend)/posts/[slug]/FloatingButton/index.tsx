"use client";

import {
  CopyPostLink,
  ScrollToComment,
  ScrollTop,
} from "../TableOfContents/TableOfContentButton";
import { Button } from "@/components/ui/button";
import { useOutsideClick } from "./useOutsideClick";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const FloatingButton = () => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible((prev) => !prev);
  const handleOutsideClick = () => setVisible(false);

  const buttonRef = useOutsideClick<HTMLButtonElement>(handleOutsideClick);

  return (
    <div className="group fixed bottom-4 right-4 z-40 xl:hidden">
      <div className="group relative flex flex-col-reverse">
        <Button
          aria-controls="post-quick-actions"
          aria-expanded={visible}
          aria-label={visible ? "빠른 이동 메뉴 닫기" : "빠른 이동 메뉴 열기"}
          size="icon"
          variant={visible ? "default" : "outline"}
          onClick={toggleVisible}
          ref={buttonRef}
          className="absolute bottom-0 right-0 z-10 h-11 w-11 rounded-xl transition-colors [&_svg]:size-5"
        >
          {visible ? <X /> : <Menu />}
        </Button>
        <div id="post-quick-actions">
          <CopyPostLink
            size={20}
            className={cn(
              "absolute bottom-0 right-0 h-11 w-11 rounded-xl opacity-0 invisible pointer-events-none transition-[transform,opacity,visibility] [&_svg]:size-5",
              visible &&
                "visible -translate-y-[10.5rem] opacity-100 pointer-events-auto",
            )}
          />
          <ScrollToComment
            className={cn(
              "absolute bottom-0 right-0 h-11 w-11 rounded-xl opacity-0 invisible pointer-events-none transition-[transform,opacity,visibility] [&_svg]:size-5",
              visible &&
                "visible -translate-y-28 opacity-100 pointer-events-auto",
            )}
          />
          <ScrollTop
            className={cn(
              "absolute bottom-0 right-0 h-11 w-11 rounded-xl opacity-0 invisible pointer-events-none transition-[transform,opacity,visibility] [&_svg]:size-5",
              visible &&
                "visible -translate-y-14 opacity-100 pointer-events-auto",
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingButton;
