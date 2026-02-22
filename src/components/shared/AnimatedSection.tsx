"use client";

import { useInView } from "@/hooks/useInView";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
