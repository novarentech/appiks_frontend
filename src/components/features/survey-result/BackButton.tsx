"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({
  onClick,
  className = "",
}: BackButtonProps) {
  return (
    <motion.div
      className={`max-w-4xl mx-auto text-center mt-12 ${className}`}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 2.6 }}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onClick}
        >
          Lihat Misi
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
