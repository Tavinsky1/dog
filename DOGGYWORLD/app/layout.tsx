import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'DOGGYWORLD',
  description: 'Dog-friendly places directory',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}