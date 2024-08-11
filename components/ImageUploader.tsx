"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  CameraIcon,
  ArrowUpTrayIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function ImageUploader() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setAnalysis(null);
      setError(null);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        "Failed to access camera. Please make sure you've granted the necessary permissions."
      );
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_image.jpg", {
              type: "image/jpeg",
            });
            setImage(file);
            const objectUrl = URL.createObjectURL(blob);
            setPreview(objectUrl);
            setAnalysis(null);
            setError(null);
          }
        }, "image/jpeg");
      }
    }
    setShowCamera(false);
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to analyze image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6 transition-all duration-300 ease-in-out">
      <Image
        src="/logo.png"
        alt="AI Image Analyzer Logo"
        width={200}
        height={200}
        loading="eager"
        className="mx-auto"
      />

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-300 ease-in-out"
        >
          <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
          Upload Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={startCamera}
          className="flex items-center justify-center px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors duration-300 ease-in-out"
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Use Camera
        </button>
      </div>

      {showCamera && (
        <div className="mt-4 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg shadow-lg"
          />
          <button
            onClick={capturePhoto}
            className="mt-2 flex items-center justify-center px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors duration-300 ease-in-out absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <PhotoIcon className="w-5 h-5 mr-2" />
            Capture Photo
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {preview && (
        <div className="mt-4 relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group">
          <Image
            src={preview}
            alt="Preview"
            layout="fill"
            objectFit="contain"
            className="transition-opacity duration-300 ease-in-out group-hover:opacity-75"
          />
          <button
            onClick={() => {
              setPreview(null);
              setImage(null);
              setAnalysis(null);
            }}
            className="absolute top-2 right-2 p-1 bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        onClick={analyzeImage}
        disabled={!image || loading}
        className={`w-full flex items-center justify-center px-4 py-2 ${
          !image || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-700 hover:bg-purple-800"
        } text-white rounded-md transition-colors duration-300 ease-in-out`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Analyzing...
          </>
        ) : (
          "Analyze Image"
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {analysis && (
        <div className="mt-6 p-6 rounded-lg shadow-inner space-y-4 animate-fade-in bg-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold">Analysis Results</h2>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Name:</span> {analysis.name}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Description:</span>{" "}
              {analysis.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
