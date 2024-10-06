import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AnalysisResultProps {
  analysis: string | null;
  error: string | null;
}

const AnalysisResult = ({ analysis, error }: AnalysisResultProps) => {
  const structureAnalysis = (text: string) => {
    const sections = text.split("\n\n");
    return sections.map((section, index) => {
      const [title, ...content] = section.split("\n");
      return (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {content.map((paragraph, pIndex) => (
            <p key={pIndex} className="mb-2">
              {paragraph}
            </p>
          ))}
        </div>
      );
    });
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-inner"
          >
            {structureAnalysis(analysis)}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnalysisResult;
