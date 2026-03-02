import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from 'react-hot-toast';
import { ProgressBar } from "@/components/progress-bar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SchoolOS | Modern Institutional Management",
  description: "The premium operating system for educational institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" />
        
        {/* Professional NProgress Custom Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          #nprogress .bar {
            background: #2563eb !important;
            height: 3px !important;
            z-index: 10000 !important;
          }
          #nprogress .peg {
            box-shadow: 0 0 10px #2563eb, 0 0 5px #2563eb !important;
          }
        `}} />
      </body>
    </html>
  );
}
