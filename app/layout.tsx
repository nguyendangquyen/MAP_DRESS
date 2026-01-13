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
  const isAdminPage = pathname?.startsWith('/dashboard')

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#fffafa]`}>
        {!isAdminPage && <Header />}
        {children}
        {!isAdminPage && <Footer />}
      </body>
    </html>
  )
}
