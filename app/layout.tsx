import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Tushar Mishra — Portfolio",
  description: "Apple-style 3D portfolio SPA",
  metadataBase: new URL("https://tushar25.com"),
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Tushar Mishra — Portfolio",
    description: "Backend systems, cloud platforms, and reliability.",
    url: "https://tushar25.com",
    siteName: "Tushar Mishra",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tushar Mishra — Portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tushar Mishra — Portfolio",
    description: "Backend systems, cloud platforms, and reliability.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
