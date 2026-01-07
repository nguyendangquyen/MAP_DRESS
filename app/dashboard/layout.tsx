import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Quản trị hệ thống',
  description: 'Trang quản trị cho admin',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* No Header for admin pages */}
      {children}
    </div>
  )
}