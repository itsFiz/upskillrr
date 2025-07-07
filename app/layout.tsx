import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '@/components/navbar'
import { Dock } from '@/components/dock'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Upskillrr - Skill Swap Platform',
  description: 'Connect, learn, and teach skills with our community-driven platform',
  manifest: '/manifest.json',
  themeColor: '#6d28d9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Upskillrr',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="pb-16 md:pb-0">{children}</main>
          <Dock />
        </Providers>
      </body>
    </html>
  )
}