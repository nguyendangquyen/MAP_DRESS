'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CalendarIcon,
  CreditCardIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import AdminSidebar from '../components/AdminSidebar'

interface DashboardData {
  totalUsers: number
  totalProducts: number
  totalRentals: number
  totalRevenue: number
  recentRentals: {
    id: string
    customer: string
    product: string
    status: string
    amount: number
  }[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    )
  }

  const stats = [
    { name: 'Tổng người dùng', value: data?.totalUsers.toString() || '0', icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Sản phẩm', value: data?.totalProducts.toString() || '0', icon: ShoppingBagIcon, color: 'bg-purple-500' },
    { name: 'Đơn thuê', value: data?.totalRentals.toString() || '0', icon: CalendarIcon, color: 'bg-pink-500' },
    { name: 'Doanh thu', value: `${((data?.totalRevenue || 0) / 1000000).toFixed(1)}M`, icon: CreditCardIcon, color: 'bg-green-500' },
  ]

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
                {data?.recentRentals.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Chưa có đơn thuê nào</p>
                ) : (
                  data?.recentRentals.map((rental) => (
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
                  ))
                )}
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
                <p className="text-2xl font-bold">{data?.totalUsers || 0}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Sản phẩm</p>
                <p className="text-2xl font-bold">{data?.totalProducts || 0}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Đơn thuê</p>
                <p className="text-2xl font-bold">{data?.totalRentals || 0}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Doanh thu</p>
                <p className="text-2xl font-bold">{((data?.totalRevenue || 0) / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}
