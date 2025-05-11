"use client";

import {
  ScrollToComment,
  ScrollTop,
} from "../TableOfContents/TableOfContentButton";
import { Button } from "@/components/ui/button";
import { useOutsideClick } from "./useOutsideClick";
import { cn } from "@/lib/utils";
import { GalleryVertical } from "lucide-react";
import { useState } from "react";

const FloatingButton = () => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible((prev) => !prev);
  const handleOutsideClick = () => setVisible(false);

  const buttonRef = useOutsideClick<HTMLButtonElement>(handleOutsideClick);

  return (
    <div className="group fixed bottom-4 right-4 xl:hidden">
      <div className="group relative flex flex-col-reverse">
        <Button
          size="icon"
          variant={visible ? "default" : "outline"}
          onClick={toggleVisible}
          ref={buttonRef}
          className={cn("absolute bottom-0 right-0 z-10 transition rounded-xl")}
        >
          <GalleryVertical size={22} />
        </Button>
        <ScrollToComment
          size={22}
          className={cn(
            "absolute bottom-0 right-0 transition rounded-xl",
            visible && "-translate-y-24"
          )}
        />
        <ScrollTop
          className={cn(
            "absolute bottom-0 right-0 transition rounded-xl",
            visible && "-translate-y-12"
          )}
          size={22}
        />
      </div>
    </div>
  );
};

export default FloatingButton;
