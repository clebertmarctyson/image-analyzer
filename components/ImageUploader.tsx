import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploaderProps {
  onImageCapture: (image: string) => void;
}

export default function ImageUploader({ onImageCapture }: ImageUploaderProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageCapture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        >
          <Upload className="mr-2 h-4 w-4" /> Upload Image
        </Button>
        <Input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <p className="mt-2 text-sm text-gray-500">
          Click to upload or drag and drop
        </p>
      </motion.div>
    </div>
  );
}
