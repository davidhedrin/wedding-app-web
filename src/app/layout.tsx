import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "boxicons/css/boxicons.min.css";

import PrelineScriptWrapper from '@/components/PrelineScriptWrapper';
import LayoutWraper from "./layout-wraper";
import Configs from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: Configs.app_name,
  description: "Wedding invitation builder platform",
  icons: {
    icon: "/assets/img/logo/wedlyvite-logo-web.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased hs-overlay-body-open bg-gray-100`}>
        <LayoutWraper children={children} />
        <PrelineScriptWrapper />
      </body>
    </html>
  );
}
