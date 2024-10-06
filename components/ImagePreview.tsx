import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { i } from "framer-motion/client";

interface ImagePreviewProps {
  image: string | null;
  onRetake: () => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export default function ImagePreview({
  image,
  onRetake,
  onAnalyze,
  isLoading,
}: ImagePreviewProps) {
  if (!image) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow relative overflow-hidden rounded-lg">
        <img
          src={image}
          alt="Captured"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex justify-between mt-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onRetake}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Retake Photo
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onAnalyze}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Analyze Image
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
