import { HeaderThemeProvider } from "@/components/ThemeProvider/HeaderTheme";
import { ThemeProvider } from "@/components/ThemeProvider/Theme";
import { PostHog } from "@/components/PostHog";
import React from "react";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <PostHog>
      <ThemeProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </ThemeProvider>
    </PostHog>
  );
};
