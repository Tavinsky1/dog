import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import HeaderWrapper from "@/components/HeaderWrapper";
import { Inter, Nunito } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', weight: ['700', '800'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable} scroll-smooth`}>
      <body className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 font-sans antialiased">
        <Providers>
          <HeaderWrapper />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
