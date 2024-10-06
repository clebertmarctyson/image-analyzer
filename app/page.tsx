"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import CameraCapture from "@/components/CameraCapture";
import ImagePreview from "@/components/ImagePreview";
import AnalysisResult from "@/components/AnalysisResult";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImageAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleImageCapture = (capturedImage: string) => {
    setImage(capturedImage);
    setAnalysis(null);
    setError(null);
    setIsCameraActive(false);
  };

  const handleRetake = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
    setIsCameraActive(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "camera") {
      setIsCameraActive(true);
    } else {
      setIsCameraActive(false);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError("Please upload or capture an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");

      const result = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await result.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError("Failed to analyze the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-500 flex flex-col p-4">
      <Card className="w-full max-w-3xl mx-auto overflow-hidden">
        <Header />
        <CardContent className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="camera">Camera</TabsTrigger>
            </TabsList>
            <TabsContent
              value="upload"
              className="h-[calc(100vh-300px)] min-h-[400px]"
            >
              {!image && <ImageUploader onImageCapture={handleImageCapture} />}
              {image && (
                <ImagePreview
                  image={image}
                  onRetake={handleRetake}
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>
            <TabsContent
              value="camera"
              className="h-[calc(100vh-300px)] min-h-[400px]"
            >
              <CameraCapture
                onImageCapture={handleImageCapture}
                isActive={isCameraActive}
              />
              {image && (
                <ImagePreview
                  image={image}
                  onRetake={handleRetake}
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mt-8 w-full max-w-3xl mx-auto"
          >
            <Card className="w-full overflow-hidden">
              <CardContent className="p-6">
                <AnalysisResult analysis={analysis} error={error} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
