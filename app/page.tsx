"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-500 flex flex-col md:flex-row items-stretch p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 md:mr-8"
      >
        <Card className="w-full h-full overflow-hidden">
          <Header />
          <CardContent className="p-6 space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="camera">Camera</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <ImageUploader onImageCapture={handleImageCapture} />
              </TabsContent>
              <TabsContent value="camera">
                <CameraCapture
                  onImageCapture={handleImageCapture}
                  isActive={isCameraActive}
                />
              </TabsContent>
            </Tabs>
            <ImagePreview
              image={image}
              onRetake={handleRetake}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 mt-8 md:mt-0 md:max-h-screen md:overflow-hidden"
      >
        <Card className="w-full h-full overflow-hidden flex flex-col">
          <CardContent className="p-6 flex-grow overflow-y-auto">
            <AnalysisResult analysis={analysis} error={error} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
