"use client";

import { useState, useEffect } from "react";

const phrases = ["Transform.", "Thrive.", "Perform.", "Optimize.", "Dominate."];

export function HeroRotatingText() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      aria-live="polite"
      className="inline-block transition-all duration-400 ease-out text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-green-dark green-glow-text"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        filter: visible ? "blur(0)" : "blur(4px)",
        transitionDuration: "400ms",
      }}
    >
      {phrases[index]}
    </span>
  );
}
