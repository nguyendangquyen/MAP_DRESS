'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeftIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon, SwatchIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import ReviewForm from '@/components/ReviewForm'
import PaymentModal from '@/components/PaymentModal'
import ReviewSection from '@/components/ReviewSection'

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
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  
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

  const handleDateSelect = (dates: string[]) => {
    setSelectedDates(dates)
  }

  const handleBookNow = () => {
    if (selectedDates.length === 0) {
      setShowCalendar(true)
      setShowWarning(true)
      return
    }
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

  
  const handlePaymentSuccess = () => {
    setRefreshKey(prev => prev + 1)
    setSelectedDates([])
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
            <div className="relative aspect-[3/4] w-full lg:max-w-md mx-auto bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-2xl group">
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
                
                <h1 className="text-[18px] lg:text-5xl xl:text-6xl font-black tracking-tighter text-brand-dark leading-snug lg:leading-[0.9] mb-6 uppercase">
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
                        <span className="text-2xl lg:text-3xl font-black text-brand-dark">{formatCurrency(product.dailyPrice)}</span>
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
                <div className="flex gap-4">
                    <button onClick={handleBookNow} className="flex-1 h-12 bg-brand-dark text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-black transition-all transform hover:-translate-y-1">
                        Đặt thuê ngay
                    </button>
                    <button onClick={() => setShowCalendar(!showCalendar)} className="flex-1 h-12 border-2 border-brand-dark/10 text-brand-dark rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2">
                        {showCalendar ? 'Đóng lịch' : <><CalendarIcon className="w-4 h-4" /> Lịch trống</>}
                    </button>
                </div>
            </div>

            {/* Calendar Expandable */}
            {showCalendar && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
                    <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-lg">
                        <AvailabilityCalendar key={refreshKey} productId={product.id} onDateSelect={handleDateSelect} />
                    </div>
                </div>
            )}

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
          </div>
        </div>

        {/* FEEDBACK SECTION */}
        <ReviewSection productId={product.id} />
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        productName={product.name}
        productPrice={product.dailyPrice}
        selectedDates={selectedDates}
        productId={product.id}
        onSuccess={handlePaymentSuccess}
      />

      {/* Custom Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/20 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowWarning(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand">
              <CalendarIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-brand-dark mb-4">Thông báo</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Vui lòng chọn ngày bạn muốn thuê trên lịch trước khi tiến hành đặt hàng.
            </p>
            <button 
              onClick={() => setShowWarning(false)}
              className="w-full h-14 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-xl hover:bg-black transition-all transform hover:scale-105"
            >
              Tôi đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
