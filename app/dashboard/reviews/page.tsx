'use client'

import { useState, useEffect } from 'react'
import { TrashIcon, ChatBubbleLeftRightIcon, StarIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import AdminSidebar from '../../components/AdminSidebar'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth-utils'

interface Review {
  id: string
  rating: number
  comment: string | null
  reply: string | null
  createdAt: string
  user: {
    name: string
    email: string
  }
  product: {
    name: string
  }
}

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews')
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReply = async (id: string) => {
    const user = getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      alert('Bạn không có quyền thực hiện thao tác này')
      return
    }

    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reply: replyText, adminId: user.id }),
      })
      if (res.ok) {
        setReplyingTo(null)
        setReplyText('')
        fetchReviews()
      }
    } catch (error) {
      alert('Lỗi khi gửi phản hồi')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản Lý Đánh Giá</h1>
            <p className="text-gray-600">Xem và phản hồi ý kiến từ khách hàng</p>
          </div>
          <Link 
            href="/dashboard/videos"
            className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
          >
            <VideoCameraIcon className="w-5 h-5" />
            Đăng Video Feedback
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Sản phẩm</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Đánh giá</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Thời gian</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Đang tải...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Chưa có đánh giá nào</td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{review.user.name}</div>
                      <div className="text-xs text-gray-500">{review.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-brand-dark">{review.product.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-yellow-500 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{review.comment}</p>
                      {review.reply && (
                        <div className="mt-2 text-xs italic text-brand flex items-center gap-1">
                          <ChatBubbleLeftRightIcon className="w-3 h-3" />
                          Phản hồi: {review.reply}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setReplyingTo(review.id)
                          setReplyText(review.reply || '')
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors mr-2"
                        title="Phản hồi"
                      >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Phản hồi */}
        {replyingTo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Phản hồi đánh giá</h3>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập nội dung phản hồi..."
                className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand min-h-[150px] mb-6"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => handleReply(replyingTo)}
                  className="flex-1 bg-brand-dark text-white py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-black transition-all"
                >
                  Gửi phản hồi
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
