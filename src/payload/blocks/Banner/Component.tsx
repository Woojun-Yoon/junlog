import type { BannerBlock as BannerBlockProps } from "@/payload-types";

import { cn } from "@/lib/utils";
import React from "react";
import RichText from "@/components/RichText";
import { Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

type Props = {
  className?: string;
} & BannerBlockProps;

const bannerConfig = {
  info: {
    icon: Info,
    bgClass:
      "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    borderClass: "border-l-4 border-blue-500 dark:border-blue-400",
    iconClass: "text-blue-600 dark:text-blue-400",
    shadowClass: "shadow-blue-100 dark:shadow-blue-900/20",
  },
  warning: {
    icon: AlertTriangle,
    bgClass:
      "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
    borderClass: "border-l-4 border-amber-500 dark:border-amber-400",
    iconClass: "text-amber-600 dark:text-amber-400",
    shadowClass: "shadow-amber-100 dark:shadow-amber-900/20",
  },
  error: {
    icon: AlertCircle,
    bgClass:
      "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
    borderClass: "border-l-4 border-red-500 dark:border-red-400",
    iconClass: "text-red-600 dark:text-red-400",
    shadowClass: "shadow-red-100 dark:shadow-red-900/20",
  },
  success: {
    icon: CheckCircle,
    bgClass:
      "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30",
    borderClass: "border-l-4 border-emerald-500 dark:border-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    shadowClass: "shadow-emerald-100 dark:shadow-emerald-900/20",
  },
};

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  const config = bannerConfig[style];
  const Icon = config.icon;

  return (
    <div className={cn("mx-auto my-8 w-full", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md",
          config.bgClass,
          config.borderClass,
          config.shadowClass,
        )}
      >
        <div className="flex items-start gap-4 p-5">
          <div className={cn("flex-shrink-0 mt-0.5", config.iconClass)}>
            <Icon className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <RichText
              data={content}
              enableGutter={false}
              enableProse={false}
              className="text-sm leading-relaxed [&_p]:m-0 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-2 [&_strong]:font-semibold"
            />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
