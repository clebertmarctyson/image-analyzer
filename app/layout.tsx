import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const metadataBase =
  process.env.NODE_ENV === "production"
    ? "https://yourdomain.com"
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(metadataBase),
  title: "AI Image Analyzer | Instant Visual Recognition",
  description:
    "Upload images and get instant AI-powered analysis. Our cutting-edge image recognition technology provides detailed descriptions and object identification in seconds.",
  keywords:
    "AI, image analysis, object recognition, machine learning, computer vision",
  authors: [{ name: "Your Name or Company Name" }],
  creator: "Your Name or Company Name",
  publisher: "Your Name or Company Name",
  openGraph: {
    title: "AI Image Analyzer | Instant Visual Recognition",
    description:
      "Get instant AI-powered analysis for any image. Upload and discover what's in your photos with our advanced recognition technology.",
    url: "/",
    siteName: "AI Image Analyzer",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AI Image Analyzer Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Analyzer | Instant Visual Recognition",
    description:
      "Upload images and get instant AI-powered analysis. Discover what's in your photos with our advanced recognition technology.",
    images: ["/logo.png"],
    creator: "@yourTwitterHandle",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/logo.png" }],
  },
  manifest: "/manifest.json",
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
