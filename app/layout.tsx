import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gym Management App',       // Old "v0 App" -> New title
  description: 'Complete gym management system for trainers and members',
  generator: 'Lalta Prasad',         // Old "v0.app" -> Your name or company
icons: {
  icon: [
    {
      url: '/placeholder-logo.png',  // New logo image
      media: '(prefers-color-scheme: light)',
    },
    {
      url: '/placeholder-logo.png',  // Same logo for dark mode
      media: '(prefers-color-scheme: dark)',
    },
  ],
  apple: '/apple-icon.png',  // Optional, can keep or replace
},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
