import "./globals.css";

export const metadata = {
  title: "Tushar Mishra — Portfolio",
  description: "3D portfolio SPA",
};

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
