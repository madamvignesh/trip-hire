import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trip Hire",
  description: "Where Every Trip Meets Precision",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <title>Trip Hire - Where Every Trip Meets Precision</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-main-back`}
      >
        
        {children}
        <Header />
      </body>
    </html>
  );
}