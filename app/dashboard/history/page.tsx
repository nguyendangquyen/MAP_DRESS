'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import { TrashIcon } from '@heroicons/react/24/outline'

interface Rental {
  id: string
  userId: string
  productId: string
  customer: string
  product: string
  productImage: string
  startDate: string
  endDate: string
  status: string
  totalPrice: number
}

const statusConfig = {
  RETURNED: { label: 'Đã trả hàng', color: 'gray' },
  CANCELLED: { label: 'Đã hủy', color: 'red' },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export default function RentalHistoryPage() {
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
        // Filter only closed rentals
        const closedRentals = data.filter((r: Rental) => 
          ['RETURNED', 'CANCELLED'].includes(r.status)
        )
        setRentals(closedRentals)
      }
    } catch (error) {
      console.error('Error fetching rentals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.')) return

    try {
      const response = await fetch(`/api/rentals/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRentals(rentals.filter(r => r.id !== id))
        alert('Xóa đơn hàng thành công!')
      } else {
        alert('Có lỗi xảy ra!')
      }
    } catch (error) {
      console.error('Error deleting rental:', error)
      alert('Có lỗi xảy ra!')
    }
  }

  const filteredRentals = filter === 'all' 
    ? rentals 
    : rentals.filter(r => r.status === filter)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lịch Sử Đơn Hàng</h1>
          <p className="text-gray-600">Quản lý các đơn thuê đã hoàn tất hoặc bị hủy</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'RETURNED', label: 'Đã trả hàng' },
            { key: 'CANCELLED', label: 'Đã hủy' },
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
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                          {rental.productImage ? (
                            <img src={rental.productImage} alt={rental.product} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                                <span className="text-xl">👗</span>
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{rental.product}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{rental.customer}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {rental.startDate.split('-').reverse().join('/')} → {rental.endDate.split('-').reverse().join('/')}
                    </td>
                    <td className="px-6 py-4 text-purple-600 font-semibold">
                      {formatCurrency(rental.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${rental.status === 'RETURNED' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>
                        {statusConfig[rental.status as keyof typeof statusConfig]?.label || rental.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(rental.id)}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Xóa
                      </button>
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
