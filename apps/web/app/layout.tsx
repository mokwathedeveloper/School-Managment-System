import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Toaster } from 'react-hot-toast';
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

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
    <html lang="en" className="scroll-smooth">
      <body className={cn(
          "min-h-screen bg-white font-sans antialiased organic-grain"
        )}>
          <Providers>
            {children}
          </Providers>
          <Toaster position="top-center" />
      </body>
    </html>
  );
}
