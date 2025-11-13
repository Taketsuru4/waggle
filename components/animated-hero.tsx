"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedHeroTitle() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Καλώς ήρθες στο ";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100); // 100ms per character

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-5xl font-bold tracking-tight leading-13">
      <span className="text-zinc-900 dark:text-zinc-50">
        {displayedText}
        {displayedText.length < fullText.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          >
            |
          </motion.span>
        )}
      </span>
      {displayedText.length === fullText.length && (
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            backgroundPosition: {
              duration: 3,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            },
          }}
          style={{
            backgroundImage:
              "linear-gradient(90deg, #0d3a0cff, #249048ff, #b3b346ff, #b99617ff)",
            backgroundSize: "200% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Waggle
        </motion.span>
      )}
    </h1>
  );
}
