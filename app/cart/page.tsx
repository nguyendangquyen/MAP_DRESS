import Link from 'next/link'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

const mockCartItems = [
  {
    id: '1',
    name: 'Váy Dạ Hội Sang Trọng',
    size: 'M',
    color: 'Đỏ',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    days: 3,
    pricePerDay: 500000,
    total: 1500000,
  },
  {
    id: '2',
    name: 'Áo Dài Truyền Thống',
    size: 'L',
    color: 'Trắng',
    startDate: '2024-02-05',
    endDate: '2024-02-07',
    days: 3,
    pricePerDay: 300000,
    total: 900000,
  },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export default function CartPage() {
  const subtotal = mockCartItems.reduce((sum, item) => sum + item.total, 0)
  const deposit = subtotal * 0.3 // 30% deposit

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ Hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {mockCartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">👗</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Size: <span className="font-semibold">{item.size}</span> | Màu: <span className="font-semibold">{item.color}</span></p>
                      <p>Thuê từ: <span className="font-semibold">{item.startDate}</span> đến <span className="font-semibold">{item.endDate}</span></p>
                      <p>Số ngày: <span className="font-semibold">{item.days} ngày</span></p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{formatCurrency(item.pricePerDay)}/ngày</p>
                        <p className="text-xl font-bold text-purple-600">{formatCurrency(item.total)}</p>
                      </div>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {mockCartItems.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">Giỏ hàng trống</p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Tóm Tắt Đơn Hàng</h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-purple-600">
                  <span>Đặt cọc (30%)</span>
                  <span className="font-semibold">{formatCurrency(deposit)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Tổng cộng</span>
                <span className="text-2xl font-bold text-purple-600">{formatCurrency(subtotal)}</span>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 shadow-lg mb-3">
                Thanh toán đặt cọc
              </button>
              
              <button className="w-full bg-white border-2 border-purple-600 text-purple-600 px-6 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-colors">
                Thanh toán toàn bộ
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Bạn sẽ thanh toán phần còn lại khi nhận hàng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
