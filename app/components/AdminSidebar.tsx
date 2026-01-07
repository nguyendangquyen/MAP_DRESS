'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  FolderIcon, 
  CalendarIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  StarIcon,
  PhotoIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

const menuItems = [
  { name: 'Tổng quan', href: '/dashboard', icon: HomeIcon },
  { name: 'Quản lý người dùng', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Quản lý sản phẩm', href: '/dashboard/products', icon: ShoppingBagIcon },
  { name: 'Quản lý danh mục', href: '/dashboard/categories', icon: FolderIcon },
  { name: 'Quản lý banner', href: '/dashboard/banners', icon: PhotoIcon },
  { name: 'Quản lý đơn thuê', href: '/dashboard/rentals', icon: CalendarIcon },
  { name: 'Thanh toán', href: '/dashboard/payments', icon: CreditCardIcon },
  { name: 'Chat hỗ trợ', href: '/dashboard/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Quản lý đánh giá', href: '/dashboard/reviews', icon: StarIcon },
  { name: 'Cài đặt', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen fixed">
      <div className="p-6">
        {/* Logo & Back to site */}
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">👗</span>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin
            </h2>
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Về trang chính
          </Link>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
