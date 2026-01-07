'use client'

import Link from 'next/link'
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CalendarIcon,
  CreditCardIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import AdminSidebar from '../components/AdminSidebar'

// Mock data - replace with real database calls
const mockData = {
  totalUsers: 248,
  totalProducts: 86,
  totalRentals: 125,
  totalRevenue: 125000000,
  recentRentals: [
    { id: '1', customer: 'Nguyễn Văn A', product: 'Váy Dạ Hội', status: 'Đang thuê', amount: 1500000 },
    { id: '2', customer: 'Trần Thị B', product: 'Suit Nam', status: 'Chờ xác nhận', amount: 2400000 },
    { id: '3', customer: 'Lê Văn C', product: 'Áo Dài', status: 'Hoàn thành', amount: 900000 },
  ]
}

const stats = [
  { name: 'Tổng người dùng', value: mockData.totalUsers.toString(), icon: UsersIcon, color: 'bg-blue-500', change: '+12%' },
  { name: 'Sản phẩm', value: mockData.totalProducts.toString(), icon: ShoppingBagIcon, color: 'bg-purple-500', change: '+5%' },
  { name: 'Đơn thuê', value: mockData.totalRentals.toString(), icon: CalendarIcon, color: 'bg-pink-500', change: '+23%' },
  { name: 'Doanh thu', value: `${(mockData.totalRevenue / 1000000).toFixed(0)}M`, icon: CreditCardIcon, color: 'bg-green-500', change: '+18%' },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Xin chào, Admin!</h1>
            <p className="text-gray-600">Đây là tổng quan hệ thống của bạn</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.name} className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                  </div>
                  <p className="text-gray-600 mb-1">{stat.name}</p>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
              )
            })}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Rentals */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Đơn Thuê Gần Đây</h3>
              <div className="space-y-3">
                {mockData.recentRentals.map((rental) => (
                  <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{rental.customer}</p>
                      <p className="text-sm text-gray-600">{rental.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{formatCurrency(rental.amount)}</p>
                      <p className="text-xs text-gray-500">{rental.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Thao Tác Nhanh</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/dashboard/products"
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
                >
                  <ShoppingBagIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-semibold text-sm">Quản lý sản phẩm</p>
                </Link>
                <Link
                  href="/dashboard/rentals"
                  className="p-4 bg-pink-50 hover:bg-pink-100 rounded-lg text-center transition-colors"
                >
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                  <p className="font-semibold text-sm">Quản lý đơn</p>
                </Link>
                <Link
                  href="/dashboard/users"
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
                >
                  <UsersIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold text-sm">Người dùng</p>
                </Link>
                <Link
                  href="/dashboard/reviews"
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
                >
                  <StarIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold text-sm">Đánh giá</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">✅ Hệ Thống Hoàn Chỉnh!</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-white/80 text-sm">Người dùng</p>
                <p className="text-2xl font-bold">{mockData.totalUsers}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Sản phẩm</p>
                <p className="text-2xl font-bold">{mockData.totalProducts}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Đơn thuê</p>
                <p className="text-2xl font-bold">{mockData.totalRentals}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Doanh thu</p>
                <p className="text-2xl font-bold">{(mockData.totalRevenue / 1000000).toFixed(0)}M</p>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}