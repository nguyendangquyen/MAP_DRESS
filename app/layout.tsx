'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/dashboard') || pathname === '/login' || pathname === '/register'

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#fffafa]`}>
        {!isAuthPage && <Header />}
        {children}
        {!isAuthPage && <Footer />}
      </body>
    </html>
  )
}
