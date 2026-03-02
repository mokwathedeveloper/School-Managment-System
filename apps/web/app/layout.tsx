import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "School Management System",
  description: "Production-grade School Management System for modern institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased"
        )}>
          <Providers>
            {children}
          </Providers>
          <Toaster position="top-center" />
      </body>
    </html>
  );
}
