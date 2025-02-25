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
  description: "Easily upload and send screenshots.",
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "32x32" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
  ],
  openGraph: {
    title: "OmniChannel Health Image Uploader",
    description: "Easily upload and send screenshots.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://default-url.com",
    siteName: "OmniChannel Health",
    images: [
      {
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://default-url.com"
        }/ochLogoBackgroundRemoved.png`,
        width: 1200,
        height: 630,
        alt: "OmniChannel Health Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniChannel Health Image Uploader",
    description: "Easily upload and send screenshots.",
    images: [
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://default-url.com"
      }/ochLogoBackgroundRemoved.png`,
    ],
  },
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
