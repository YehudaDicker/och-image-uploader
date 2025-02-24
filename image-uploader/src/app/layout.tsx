import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OmniChannel Health Image Uploader",
  description: "OmniChannel Health Image Uploader",
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "32x32" }, // Default favicon
    { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16" }, // Small favicon
    { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32" }, // Standard favicon
    { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192" }, // Used by Android/Chrome
    { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512" }, // High-res
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" }, // iOS/macOS
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
