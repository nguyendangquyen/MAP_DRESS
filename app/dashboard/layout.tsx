import type { Metadata } from 'next'

import { auth } from '@/auth.config'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Admin Dashboard | MAP DRESS',
  description: 'Trang quản trị hệ thống',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div>
      {/* No Header for admin pages */}
      {children}
    </div>
  )
}