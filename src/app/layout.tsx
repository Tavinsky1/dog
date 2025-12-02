import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import HeaderWrapper from "@/components/HeaderWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Inter, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { generateSEOMetadata } from "@/lib/seo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["700", "800"] });

export const metadata = generateSEOMetadata({
  title: 'Dog Atlas - Discover Dog-Friendly Places Worldwide',
  description: 'Find the best dog-friendly parks, cafés, restaurants, hotels, trails, and services in cities around the world. Your ultimate guide to exploring with your dog.',
  keywords: ['dog friendly places', 'pet friendly cafes', 'dog parks near me', 'dog friendly hotels', 'pet travel guide'],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Get session on server to hydrate client
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable} scroll-smooth`}>
      <body className="min-h-screen bg-gray-50">
        <GoogleAnalytics />
        <Providers session={session}>
          <HeaderWrapper />
          <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            {children}
          </main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
