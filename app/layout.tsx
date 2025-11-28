import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Karapat Discount PH',
  description: 'Calculate discounts for senior citizens and persons with disability (PWD) in the Philippines. Get instant 20% discount and VAT exemption calculations based on Republic Act No. 10754.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      {
        url: '/icon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/icon-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        url: '/logo.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
    shortcut: '/icon-64x64.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
