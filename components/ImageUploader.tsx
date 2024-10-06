import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploaderProps {
  onImageCapture: (image: string) => void;
}

const ImageUploader = ({ onImageCapture }: ImageUploaderProps) => {
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
    <motion.div
      className="flex justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
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
    </motion.div>
  );
};

export default ImageUploader;
