'use client'

import { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import { getCurrentUser } from '@/lib/auth-utils'
import NotificationModal from './NotificationModal'

interface Review {
  id: string
  rating: number
  comment: string | null
  reply: string | null
  createdAt: string
  user: {
    name: string
    image: string | null
  }
}

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hover, setHover] = useState(0)

  const [notification, setNotification] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'info'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message })
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const user = getCurrentUser()
    if (!user) {
      showNotification('info', 'Thông báo', 'Bạn cần đăng nhập để thực hiện đánh giá')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId, 
          rating, 
          comment, 
          userId: user.id 
        }),
      })
      if (res.ok) {
        setComment('')
        setRating(5)
        await fetchReviews()
        showNotification('success', 'Thành công', 'Cảm ơn bạn đã gửi đánh giá! Đánh giá sẽ xuất hiện ngay lập tức.')
      } else {
        const data = await res.json().catch(() => ({ error: 'Lỗi không xác định từ máy chủ' }))
        console.error('Submission error:', data)
        showNotification('error', 'Lỗi', data.error || 'Không thể gửi đánh giá lúc này')
      }
    } catch (error) {
      console.error('Connection error:', error)
      showNotification('error', 'Lỗi kết nối', 'Vui lòng kiểm tra lại mạng của bạn.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-16 border-t pt-10">
      <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">
        Đánh giá của khách hàng ({reviews.length})
      </h3>

      {/* Form viết đánh giá */}
      <div className="bg-brand-light/10 p-6 rounded-[2rem] mb-12 border border-brand/10">
        <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-widest">Viết đánh giá của bạn</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110"
              >
                {star <= (hover || rating) ? (
                  <StarIcon className="w-8 h-8 text-yellow-500" />
                ) : (
                  <StarOutline className="w-8 h-8 text-gray-300" />
                )}
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none min-h-[120px]"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-dark text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      </div>

      {/* Danh sách đánh giá */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500 font-medium py-10 uppercase text-xs tracking-widest">
            Chưa có đánh giá nào cho sản phẩm này
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border-b border-gray-100 pb-8 last:border-0">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-brand-dark uppercase">
                  {review.user.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-black text-gray-900 text-sm uppercase">{review.user.name}</h5>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-xs text-gray-400 font-medium">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 pl-16">
                {review.comment}
              </p>

              {/* Phản hồi từ Admin */}
              {review.reply && (
                <div className="ml-16 bg-gray-50 p-4 rounded-2xl border-l-4 border-brand">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-dark text-white text-[8px] font-black uppercase px-2 py-0.5 rounded">Admin</span>
                    <span className="font-black text-gray-900 text-[10px] uppercase">Phản hồi từ MAP DRESS</span>
                  </div>
                  <p className="text-gray-600 text-xs italic">
                    "{review.reply}"
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  )
}
