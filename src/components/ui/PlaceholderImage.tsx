"use client";

import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  productName: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PlaceholderImage({
  productName,
  className = "",
  size = "md",
}: PlaceholderImageProps) {
  const sizeClasses = {
    sm: "h-32 w-32",
    md: "h-48 w-48",
    lg: "h-64 w-64",
  };

  // Generate a consistent color based on product name
  const getColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-gray-100 to-gray-200",
      "bg-gradient-to-br from-blue-50 to-blue-100",
      "bg-gradient-to-br from-purple-50 to-purple-100",
      "bg-gradient-to-br from-green-50 to-green-100",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      className={cn(sizeClasses[size], getColor(productName), className, "flex items-center justify-center rounded-xl")}
    >
      <div className="text-center">
        <Smartphone className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-xs text-gray-500">{productName}</p>
      </div>
    </div>
  );
}
