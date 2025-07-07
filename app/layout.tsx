import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Upskillrr - Skill Swap Platform',
  description: 'Connect, learn, and teach skills with our community-driven platform',
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
          <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}