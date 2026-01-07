'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/AdminSidebar'

interface Rental {
  id: string
  customer: string
  product: string
  startDate: string
  endDate: string
  status: string
  amount: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export default function RentalCalendarPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'ACTIVE' | 'CONFIRMED'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    try {
      const response = await fetch('/api/rentals')
      if (response.ok) {
        const data = await response.json()
        // Filter out RETURNED rentals - only show active rentals in calendar
        const activeRentals = data.filter((r: Rental) => r.status !== 'RETURNED')
        setRentals(activeRentals)
      }
    } catch (error) {
      console.error('Error fetching rentals:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filteredRentals = filter === 'all' 
    ? rentals 
    : rentals.filter(r => r.status === filter)

  const rentingCount = rentals.filter(r => r.status === 'ACTIVE').length
  const bookedCount = rentals.filter(r => r.status === 'PENDING').length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lịch Thuê</h1>
          <p className="text-gray-600">Theo dõi sản phẩm đang thuê và đặt trước</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-600 mb-1">Đang thuê</p>
            <p className="text-3xl font-bold text-orange-600">{rentingCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-600 mb-1">Đặt trước</p>
            <p className="text-3xl font-bold text-blue-600">{bookedCount}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'Tất cả', color: 'purple' },
            { key: 'ACTIVE', label: 'Đang thuê', color: 'orange' },
            { key: 'PENDING', label: 'Đặt trước', color: 'blue' },
            { key: 'CONFIRMED', label: 'Đã xác nhận', color: 'green' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === tab.key
                  ? `bg-${tab.color}-600 text-white`
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: filter === tab.key 
                  ? tab.color === 'purple' ? '#9333EA' 
                    : tab.color === 'orange' ? '#EA580C' 
                    : tab.color === 'blue' ? '#2563EB' 
                    : '#16A34A'
                  : undefined,
                color: filter === tab.key ? 'white' : undefined
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rentals List */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sản phẩm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Khách hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày bắt đầu</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày kết thúc</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tổng tiền</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    Đang tải...
                  </td>
                </tr>
              ) : filteredRentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                        <span className="text-xl">👗</span>
                      </div>
                      <span className="font-medium">{rental.product}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{rental.customer}</td>
                  <td className="px-6 py-4 text-gray-600">{rental.startDate}</td>
                  <td className="px-6 py-4 text-gray-600">{rental.endDate}</td>
                  <td className="px-6 py-4 text-purple-600 font-semibold">{formatCurrency(rental.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      rental.status === 'ACTIVE' ? 'bg-orange-100 text-orange-700' :
                      rental.status === 'PENDING' ? 'bg-blue-100 text-blue-700' :
                      rental.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {rental.status === 'ACTIVE' ? 'Đang thuê' :
                       rental.status === 'PENDING' ? 'Đặt trước' :
                       rental.status === 'CONFIRMED' ? 'Đã xác nhận' : rental.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
