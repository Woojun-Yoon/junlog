import localFont from "next/font/local";

const JetBrainsMono = localFont({
  src: "../../../../public/fonts/JetBrainsMono-Regular.woff2",
  display: "swap",
  // Rich text can render without code, so fetch this font only when code uses it.
  preload: false,
  variable: "--font-jetbrains-mono",
});

export { JetBrainsMono };
