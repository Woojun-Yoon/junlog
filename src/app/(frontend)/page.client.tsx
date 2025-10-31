"use client";

import { useHeaderTheme } from "@/components/ThemeProvider/HeaderTheme";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const PageClient = () => {
  const { setHeaderTheme } = useHeaderTheme();
  const router = useRouter();

  useEffect(() => {
    setHeaderTheme("light");
  }, [setHeaderTheme]);

  return (
    <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center">
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl font-bold md:text-5xl lg:text-7xl">
          {"Understand everything like scratch"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-sm sm:text-base md:text-lg font-normal word-break: break-keep text-neutral-600 dark:text-neutral-400"
        >
          기술과 개념을{" "}
          <a
            href="https://scratch.mit.edu/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-black dark:hover:text-white transition-colors"
          >
            Scratch
          </a>
          처럼 직관적이고, 논리적으로,{" "}
          <span className="hidden sm:inline">
            <br />
          </span>
          그리고 쉽게 이해할 수 있도록 풀어갑니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => router.push("/posts")}
            className="w-full sm:w-48 md:w-60 transform rounded-lg bg-black px-6 py-2 text-sm sm:text-base md:text-lg font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Explore Now
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="w-full sm:w-48 md:w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm sm:text-base md:text-lg font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
          >
            Contact Me
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PageClient;
