import React from "react"
import type { Metadata } from 'next'
import { Space_Grotesk, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: 'Songify | Discover Your Music',
  description: 'A modern music discovery platform powered by Spotify',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/placeholder-user.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/placeholder-user.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/placeholder-user.jpg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/placeholder-user.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${outfit.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
