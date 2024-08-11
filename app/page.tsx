import ImageUploader from "@/components/ImageUploader";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <ImageUploader />
    </main>
  );
}
