import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/context/Providers";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARKATVERSE - Everything. Everyone. Everywhere.",
  description: "The global marketplace connecting people, businesses and opportunities.",
};

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>
          <ConditionalNavbar />
          {children}
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
