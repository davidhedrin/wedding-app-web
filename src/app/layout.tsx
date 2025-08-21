import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "boxicons/css/boxicons.min.css";

import PrelineScriptWrapper from '@/components/PrelineScriptWrapper';
import LayoutWraper from "./layout-wraper";
import Configs from "@/lib/config";
import { LoadingProvider } from "@/components/loading/loading-context";
import Loading from "@/components/loading/loading";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/toast-provider";
import ModalConfirm from "@/components/modal-confirm";

// const fontStyleApp = Work_Sans({
//   variable: "--font-work-sans",
//   subsets: ["latin"],
//   weight: ["400", "500", "700"],
//   display: "swap",
// });
// const fontStyleApp = Rubik({
//   variable: "--font-rubik",
//   subsets: ["latin"],
//   weight: ["400", "500", "700"],
//   display: "swap",
// });
const fontStyleApp = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontStyleApp.className} antialiased hs-overlay-body-open bg-gray-100`}>
        <ModalConfirm />
        <ToastProvider />
        <SessionProvider>
          <LoadingProvider>
            <Loading />
            <LayoutWraper children={children} />
            <PrelineScriptWrapper />
          </LoadingProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
