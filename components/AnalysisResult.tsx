import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Copy, Check } from "lucide-react";

interface AnalysisResultProps {
  analysis: string | null;
  error: string | null;
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
];

export default function AnalysisResult({
  analysis,
  error,
}: AnalysisResultProps) {
  const [translatedAnalysis, setTranslatedAnalysis] = useState<string | null>(
    null
  );
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isCopied, setIsCopied] = useState(false);
  const plainTextRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(() => {
    if (plainTextRef.current) {
      const plainText = plainTextRef.current.innerText;
      navigator.clipboard.writeText(plainText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  const handleTranslate = useCallback(
    async (lang: string) => {
      if (analysis) {
        setSelectedLanguage(lang);
        // Here you would typically call your translation API
        // For this example, we'll just append a message
        setTranslatedAnalysis(`<p>[Translated to ${lang}]</p>${analysis}`);
      }
    },
    [analysis]
  );

  if (!analysis && !error) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Analysis Result</h2>
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
            className="space-y-4"
          >
            <div
              className="p-6 bg-white rounded-lg shadow-md prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: translatedAnalysis || analysis,
              }}
            />
            <div
              ref={plainTextRef}
              className="sr-only"
              dangerouslySetInnerHTML={{
                __html: translatedAnalysis || analysis,
              }}
            />
            <div className="flex justify-between items-center">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex items-center"
              >
                {isCopied ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {isCopied ? "Copied!" : "Copy Result"}
              </Button>
              <Select onValueChange={handleTranslate} value={selectedLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
