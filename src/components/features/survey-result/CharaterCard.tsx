"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";

interface CharacterProps {
  title: string;
  content: string;
  color: string;
  className?: string;
  showImage?: boolean;
  values?: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right" | "top" | "bottom";
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Color mapping for Tailwind classes
const colorMap = {
  "blue-600": {
    bg: "bg-blue-600",
    border: "border-blue-600",
  },
  "purple-600": {
    bg: "bg-purple-600",
    border: "border-purple-600",
  },
  "green-600": {
    bg: "bg-green-600",
    border: "border-green-600",
  },
  "yellow-500": {
    bg: "bg-yellow-500",
    border: "border-yellow-500",
  },
  "sky-900": {
    bg: "bg-sky-900",
    border: "border-sky-900",
  },
  "red-600": {
    bg: "bg-red-600",
    border: "border-red-600",
  },
  "orange-600": {
    bg: "bg-orange-600",
    border: "border-orange-600",
  },
  "rose-500": {
    bg: "bg-rose-500",
    border: "border-rose-500",
  },
};

export function CharacterCard({
  title,
  content,
  color,
  values,
  className = "",
  showImage = false,
  imageSrc = "/icon/ico-walk-3.webp",
  imageAlt = "Icon",
  imagePosition = "right",
}: CharacterProps) {
  // Get color classes from map, fallback to blue-600 if color not found
  const colorClasses =
    colorMap[color as keyof typeof colorMap] || colorMap["blue-600"];

  // Function to get layout classes based on image position
  const getLayoutClasses = () => {
    if (!showImage) return "text-center";

    switch (imagePosition) {
      case "left":
        return "flex flex-col lg:flex-row-reverse items-center gap-4";
      case "right":
        return "flex flex-col lg:flex-row items-center gap-4";
      case "top":
        return "flex flex-col-reverse items-center gap-4 text-center";
      case "bottom":
        return "flex flex-col items-center gap-4 text-center";
      default:
        return "flex flex-col lg:flex-row items-center gap-4";
    }
  };

  const getTextClasses = () => {
    if (!showImage) return "";

    switch (imagePosition) {
      case "left":
      case "right":
        return "flex-1 text-left";
      case "top":
      case "bottom":
        return "text-center";
      default:
        return "flex-1 text-left";
    }
  };
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border ${colorClasses.border} overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className={`${colorClasses.bg} p-3 sm:p-4 lg:p-6`}>
        <h3 className="text-white text-sm sm:text-lg lg:text-xl font-bold text-center">
          {title}
        </h3>
      </div>
      <div className={`p-3 sm:p-4 lg:p-6 ${getLayoutClasses()}`}>
        <div className={`text-xs sm:text-sm lg:text-base ${getTextClasses()}`}>
          <p>{content}</p>
          <p className="space-x-2">
            {values?.split(",").map((value: string, index: number) => (
              <Badge
                key={index}
                className="bg-yellow-50 text-yellow-500 px-2 py-1 rounded-full text-xs sm:text-sm hover:bg-yellow-200 transition-colors cursor-default"
              >
                {value.trim()}
              </Badge>
            ))}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-3"></div>
        {showImage && (
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={60}
            height={60}
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
          />
        )}
      </div>
    </motion.div>
  );
}
