"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  /** Wait for the user to actually scroll before allowing trigger */
  waitForScroll?: boolean;
}

export function useInView({ threshold = 0.1, rootMargin = "0px", waitForScroll = false }: UseInViewOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let hasScrolled = !waitForScroll;
    let isIntersecting = false;

    const tryActivate = () => {
      if (hasScrolled && isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    };

    const onScroll = () => {
      hasScrolled = true;
      window.removeEventListener("scroll", onScroll);
      tryActivate();
    };

    if (waitForScroll) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isIntersecting = true;
          tryActivate();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold, rootMargin, waitForScroll]);

  return { ref, isInView };
}
