import localFont from "next/font/local";

const Pretendard = localFont({
  src: [
    {
      path: "../../../public/fonts/PretendardVariable.woff2",
    },
  ],
  display: "swap",
  variable: "--font-pretendard",
});

const JetBrainsMono = localFont({
  src: [
    {
      path: "../../../public/fonts/JetBrainsMono-Regular.woff2",
    },
  ],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export { Pretendard, JetBrainsMono };
