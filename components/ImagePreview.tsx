import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-4 space-y-4"
      >
        <img
          src={image}
          alt="Captured"
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <div className="flex justify-between">
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
      </motion.div>
    </AnimatePresence>
  );
}
