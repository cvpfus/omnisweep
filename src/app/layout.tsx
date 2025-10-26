import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Web3Provider from "@/providers/Web3Provider";
import Header from "@/components/blocks/header";
import Script from "next/script";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OmniSweep",
  description: "Consolidate your tokens from multiple blockchains into a single destination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hankenGrotesk.variable} antialiased`}>
        <Web3Provider>
          <div className="flex flex-col items-center justify-items-center min-h-screen p-6 gap-y-12">
            <Header />
            {children}
          </div>
        </Web3Provider>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js"  />
    </html>
  );
}
