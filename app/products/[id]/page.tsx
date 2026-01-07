'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeftIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon, SwatchIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline'
import AvailabilityCalendar from '../../components/AvailabilityCalendar'
import ReviewForm from '../../components/ReviewForm'
import PaymentModal from '../../components/PaymentModal'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedDates, setSelectedDates] = useState<number[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleDateSelect = (dates: number[]) => {
    setSelectedDates(dates)
  }

  const handleBookNow = () => {
    setShowPaymentModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white">
        <h2 className="text-xl font-black text-brand-dark mb-4 uppercase tracking-tighter">Sản phẩm không tồn tại</h2>
        <Link href="/products" className="text-brand font-black uppercase text-[10px] tracking-widest hover:underline">
          Quay lại cửa hàng
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar - Refined & Fixed Overlap */}
      <nav className="sticky top-20 z-40 bg-white/60 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <Link href="/products" className="group flex items-center gap-2 text-brand-dark/60 hover:text-brand-dark transition-all duration-300">
            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand/10 group-hover:scale-110 transition-all">
                <ArrowLeftIcon className="w-3 h-3" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Back to Gallery</span>
          </Link>
          <div className="flex items-center gap-4">
              <span className="h-[1px] w-4 bg-gray-200"></span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">Viewing: {product.name}</span>
          </div>
          <div className="w-6"></div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
          
          {/* LEFT: Visual Assets (5 columns instead of 7) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[3/4] max-w-md mx-auto bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-2xl group">
              {product.images?.length > 0 ? (
                <img 
                  src={product.images[currentImageIndex].url} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-8xl grayscale opacity-20">👗</div>
              )}
              
              {/* Navigation Overlay */}
              {product.images?.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button onClick={() => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)} className="pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-white transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100">
                    <ChevronLeftIcon className="w-5 h-5 text-brand-dark" />
                  </button>
                  <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)} className="pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-white transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100">
                    <ChevronRightIcon className="w-5 h-5 text-brand-dark" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {product.images?.length > 1 && (
                <div className="flex flex-wrap gap-4 px-2">
                    {product.images.map((img: any, idx: number) => (
                        <button 
                            key={idx} 
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-brand-dark scale-90' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        >
                            <img src={img.url} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* RIGHT: Product Meta (7 columns instead of 5) */}
          <div className="lg:col-span-7 lg:sticky lg:top-32 space-y-10">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <span className="h-[1px] w-8 bg-brand"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-dark">{product.category?.name || 'BST Mới'}</span>
                </div>
                
                <h1 className="text-5xl xl:text-6xl font-black tracking-tighter text-brand-dark leading-[0.9] mb-6 uppercase">
                    {product.name}
                </h1>
                
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                    {product.description || 'Sản phẩm cao cấp được tuyển chọn kỹ lưỡng, mang đến vẻ đẹp sang trọng và đẳng cấp cho quý cô.'}
                </p>
            </div>

            {/* Price Card */}
            <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                <div className="mb-8">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">Giá thuê trong ngày</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-brand-dark">{formatCurrency(product.dailyPrice)}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/ ngày</span>
                    </div>
                </div>

                {/* Colors Section */}
                {product.colors?.length > 0 && (
                    <div className="mb-8">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-4">Màu sắc có sẵn</span>
                        <div className="flex flex-wrap gap-4">
                            {product.colors.map((c: any) => (
                                <div key={c.id} className="flex items-center gap-2 group cursor-default">
                                    <div className="w-4 h-4 rounded-full border border-brand-light shadow-sm" style={{ backgroundColor: '#fdf2f2' }}></div>
                                    <span className="text-[11px] font-black uppercase tracking-tighter text-brand-dark group-hover:text-brand transition-colors">{c.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={handleBookNow} className="flex-1 h-16 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-2xl hover:bg-black transition-all transform hover:-translate-y-1">
                        Đặt thuê ngay
                    </button>
                    <button onClick={() => setShowCalendar(!showCalendar)} className="h-16 px-8 border-2 border-brand-dark/10 text-brand-dark rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2">
                        {showCalendar ? 'Đóng lịch' : <><CalendarIcon className="w-4 h-4" /> Lịch trống</>}
                    </button>
                </div>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 px-4">
                <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-brand" />
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-tighter text-brand-dark">Khử trùng UV</span>
                        <span className="text-[8px] text-gray-400 uppercase tracking-widest">Tiêu chuẩn spa</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <TruckIcon className="w-5 h-5 text-brand" />
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-tighter text-brand-dark">Giao nhanh 2h</span>
                        <span className="text-[8px] text-gray-400 uppercase tracking-widest">Khu vực nội thành</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <SwatchIcon className="w-5 h-5 text-brand" />
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-tighter text-brand-dark">BST Tuyển chọn</span>
                        <span className="text-[8px] text-gray-400 uppercase tracking-widest">Hàng hiệu 100%</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-brand" />
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-tighter text-brand-dark">Hỗ trợ 24/7</span>
                        <span className="text-[8px] text-gray-400 uppercase tracking-widest">Tư vấn tận tâm</span>
                    </div>
                </div>
            </div>

            {/* Calendar Expandable */}
            {showCalendar && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl">
                        <AvailabilityCalendar productId={product.id} onDateSelect={handleDateSelect} />
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* FEEDBACK SECTION */}
        <div className="mt-32 pt-20 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 px-4">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand block mb-4">Social Proof</span>
                    <h2 className="text-4xl font-black tracking-tighter uppercase text-brand-dark">Đánh giá thực tế</h2>
                </div>
                <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-[10px] font-black uppercase tracking-widest text-brand-dark py-3 px-8 rounded-full border-2 border-brand-dark/5 hover:bg-brand-dark hover:text-white transition-all">
                    {showReviewForm ? 'Thoát chế độ viết' : 'Gửi lời khen sản phẩm'}
                </button>
            </div>

            {showReviewForm && (
                <div className="max-w-2xl mx-auto mb-20 bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                    <ReviewForm productId={product.id} productName={product.name} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-brand/30 transition-all hover:shadow-xl group">
                        <div className="flex gap-1 mb-6">
                            {[1, 2, 3, 4, 5].map(s => <svg key={s} className="w-3 h-3 text-brand fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>)}
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">"Trải nghiệm tuyệt vời từ lúc chọn đồ đến lúc mặc. Váy rất mới, thơm và đóng gói chỉn chu. Sẽ còn quay lại nhiều lần!"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand/10 group-hover:bg-brand/20 transition-colors flex items-center justify-center font-black text-xs text-brand-dark">ML</div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase text-brand-dark tracking-tighter">Khanh Vy</h4>
                                <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Verified Client</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        productName={product.name}
        productPrice={product.dailyPrice}
        selectedDates={selectedDates}
      />
    </div>
  )
}
