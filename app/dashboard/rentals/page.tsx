'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import { PencilIcon, ClockIcon } from '@heroicons/react/24/outline'

interface Rental {
  id: string
  userId: string
  productId: string
  customer: string
  product: string
  startDate: string
  endDate: string
  status: string
  totalPrice: number
}

const statusConfig = {
  PENDING: { label: 'Đặt trước', color: 'blue' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'green' },
  ACTIVE: { label: 'Đang thuê', color: 'orange' },
  RETURNED: { label: 'Đã trả hàng', color: 'gray' },
  CANCELLED: { label: 'Đã hủy', color: 'red' },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export default function RentalsManagementPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    try {
      const response = await fetch('/api/rentals')
      if (response.ok) {
        const data = await response.json()
        setRentals(data)
      }
    } catch (error) {
      console.error('Error fetching rentals:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/rentals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedRental = await response.json()
        setRentals(rentals.map(r => r.id === id ? updatedRental : r))
        alert('Cập nhật trạng thái thành công!')
      } else {
        alert('Có lỗi xảy ra!')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Có lỗi xảy ra!')
    }
  }

  const filteredRentals = filter === 'all' 
    ? rentals 
    : rentals.filter(r => r.status === filter)

  const stats = {
    pending: rentals.filter(r => r.status === 'PENDING').length,
    active: rentals.filter(r => r.status === 'ACTIVE').length,
    returned: rentals.filter(r => r.status === 'RETURNED').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Quản Lý Đơn Thuê</h1>
          <p className="text-gray-600">Theo dõi và quản lý trạng thái đơn hàng</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-600 mb-1">Đặt trước</p>
            <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-600 mb-1">Đang thuê</p>
            <p className="text-3xl font-bold text-orange-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-600 mb-1">Đã trả hàng</p>
            <p className="text-3xl font-bold text-gray-600">{stats.returned}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'PENDING', label: 'Đặt trước' },
            { key: 'CONFIRMED', label: 'Đã xác nhận' },
            { key: 'ACTIVE', label: 'Đang thuê' },
            { key: 'RETURNED', label: 'Đã trả hàng' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === tab.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rentals Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sản phẩm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Khách hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày thuê</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tổng tiền</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    Đang tải...
                  </td>
                </tr>
              ) : filteredRentals.length > 0 ? (
                filteredRentals.map((rental) => (
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
                    <td className="px-6 py-4 text-gray-600">
                      {rental.startDate} → {rental.endDate}
                    </td>
                    <td className="px-6 py-4 text-purple-600 font-semibold">
                      {formatCurrency(rental.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${rental.status === 'PENDING' ? 'bg-blue-100 text-blue-700' :
                          rental.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          rental.status === 'ACTIVE' ? 'bg-orange-100 text-orange-700' :
                          rental.status === 'RETURNED' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {statusConfig[rental.status as keyof typeof statusConfig]?.label || rental.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={rental.status}
                        onChange={(e) => updateStatus(rental.id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="PENDING">Đặt trước</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="ACTIVE">Đang thuê</option>
                        <option value="RETURNED">Đã trả hàng</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
