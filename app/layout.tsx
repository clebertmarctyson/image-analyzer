import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const metadataBase =
  process.env.NODE_ENV === "production"
    ? "https://image-analyzer.vercel.app"
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(metadataBase),
  title: "AI Image Analyzer | Instant Visual Recognition",
  description:
    "Upload images and get instant AI-powered analysis. Our cutting-edge image recognition technology provides detailed descriptions and object identification in seconds.",
  keywords:
    "AI, image analysis, object recognition, machine learning, computer vision",
  authors: [{ name: "Marc Tyson CLEBERT" }],
  creator: "Marc Tyson CLEBERT",
  publisher: "Marc Tyson CLEBERT",
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
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AI Image Analyzer Logo",
      },
    ],
    creator: "@ClebertTyson",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code-here",
  },
  alternates: {
    canonical: "/",
  },
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
      <body
        className="antialiased text-gray-900 bg-white dark:bg-black dark:text-white"
        style={inter.style}
      >
        {children}
      </body>
      <Script
        id="register-sw"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/service-worker.js');
              });
            }
          `,
        }}
      />
    </html>
  );
}
