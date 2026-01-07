'use client'

import { useState } from 'react'
import { XMarkIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline'

interface Props {
  isOpen: boolean
  onClose: () => void
  productName: string
  productPrice: number
  selectedDates: number[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export default function PaymentModal({ isOpen, onClose, productName, productPrice, selectedDates }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<'deposit' | 'full'>('deposit')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const totalDays = selectedDates.length || 1
  const totalAmount = productPrice * totalDays
  const depositAmount = totalAmount * 0.3

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h3>
          <p className="text-gray-600">Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Thanh Toán</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Chi Tiết Đơn Hàng</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Sản phẩm:</span>
                <span className="font-semibold">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số ngày thuê:</span>
                <span className="font-semibold">{totalDays} ngày</span>
              </div>
              {selectedDates.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đã chọn:</span>
                  <span className="font-semibold">{selectedDates.join(', ')}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-bold text-purple-600 text-lg">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Hình Thức Thanh Toán</h3>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('deposit')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'deposit'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BanknotesIcon className="w-6 h-6 text-purple-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold">Đặt cọc 30%</p>
                    <p className="text-sm text-gray-600">Thanh toán {formatCurrency(depositAmount)} ngay</p>
                  </div>
                  {paymentMethod === 'deposit' && (
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('full')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'full'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCardIcon className="w-6 h-6 text-purple-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold">Thanh toán toàn bộ</p>
                    <p className="text-sm text-gray-600">Thanh toán {formatCurrency(totalAmount)} ngay</p>
                  </div>
                  {paymentMethod === 'full' && (
                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <form onSubmit={handleSubmit}>
            <h3 className="font-bold text-lg mb-3">Thông Tin Khách Hàng</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Họ và tên"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <textarea
                placeholder="Ghi chú (tùy chọn)"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Submit */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Xác nhận đặt thuê
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
