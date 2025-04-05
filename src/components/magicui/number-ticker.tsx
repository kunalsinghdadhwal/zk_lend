"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useInView } from "framer-motion";
import { start } from "repl";

interface NumberTickerProps {
  value: number;
  className?: string;
  direction?: "up" | "down";
  decimalPlaces?: number;
  delay?: number;
  startValue?: number;
  check ?: string;
}

export function NumberTicker({
  value,
  className,
  direction = "up",
  decimalPlaces = 1,
  delay = 0,
  startValue = 1,
  check = "0",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  startValue = check === "0" ? 100 : startValue;
  decimalPlaces = check === "0" ? 0 : decimalPlaces;
  const motionValue = useMotionValue(direction === "up" ? startValue : value);
  const springValue = useSpring(motionValue, {
    damping: 80,
    stiffness: 700,
  });
  const isInView = useInView(ref, { once: false }); // Changed to false to allow multiple animations

  useEffect(() => {
    if (isInView) {
      // Initial animation
      const initialTimer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value);
      }, delay * 1000);
      
      // Set up recurring animation every 5 seconds
      const intervalTimer = setInterval(() => {
        // Reset to start value
        motionValue.set(direction === "up" ? startValue : value);
        
        // After a short delay, animate to the target value
        setTimeout(() => {
          motionValue.set(direction === "down" ? startValue : value);
        }, 200);
      }, 5000);
      
      return () => {
        clearTimeout(initialTimer);
        clearInterval(intervalTimer);
      };
    }
  }, [motionValue, isInView, delay, value, direction, startValue]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
        }
      }),
    [springValue, decimalPlaces],
  );

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-block" }}
    >
      {startValue}
    </span>
  );
}
