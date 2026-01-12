'use client'

import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon, ClockIcon, ShieldCheckIcon, PlayIcon, StarIcon, TrophyIcon, UserGroupIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import AnimatedSection from './components/AnimatedSection'
import ProductCard from './components/ProductCard'
import { getCurrentUser } from './lib/auth-utils'

// Product interface matching API
interface Product {
  id: string
  name: string
  description?: string
  dailyPrice: number
  price?: number
  isBestSeller: boolean
  updatedAt: string
  images: { url: string }[]
  category?: { name: string }
}

interface VideoReview {
  id: string
  productName: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  featured: boolean
  type: 'review' | 'feedback'
  createdAt: string
}

export default function HomePage() {
  const [featuredVideos, setFeaturedVideos] = useState<VideoReview[]>([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<VideoReview | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [newArrivals, setNewArrivals] = useState<any[]>([])
  const [bestSellers, setBestSellers] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    fetchFeaturedVideos()
    fetchProducts()
    setIsLoggedIn(!!getCurrentUser())
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        // New arrivals: latest 4 updated products
        setNewArrivals(data.slice(0, 4))
        // Best sellers: products with isBestSeller flag
        setBestSellers(data.filter((p: any) => p.isBestSeller).slice(0, 4))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchFeaturedVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const videos = await response.json()
        const featured = videos.filter((v: VideoReview) => v.featured).slice(0, 4)
        setFeaturedVideos(featured)
      }
    } catch (error) {
      console.error('Error fetching featured videos:', error)
    } finally {
      setLoadingVideos(false)
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fffafa]">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-brand-light/20">
          {/* Animated Blobs - Soft Pink Palette */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand/30 rounded-full blur-[120px] animate-pulse-soft"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-dark/20 rounded-full blur-[120px] animate-pulse-soft animation-delay-500"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-brand-light/40 rounded-full blur-[100px] animate-float"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="space-y-6 md:space-y-10">
            <AnimatedSection animation="fade-in-down">
              <span className="inline-block py-2 px-6 rounded-full glass-morphism text-brand-dark font-black text-[10px] tracking-[0.3em] uppercase mb-4 border border-brand/20">
                ✨ Elegance in Every Thread
              </span>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-in-up" delay={200}>
                <h1 className="text-4xl md:text-8xl font-black mb-4 tracking-tighter leading-[0.9] text-gray-900">
                MAP <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark via-brand to-brand-dark animate-gradient-text">DRESS</span>
                </h1>
                <p className="text-sm md:text-xl font-bold text-brand-dark/80 tracking-widest uppercase mt-1">
                  Fashion Rental Studio
                </p>
            </AnimatedSection>

            <AnimatedSection animation="fade-in-up" delay={400}>
                <p className="text-sm md:text-lg mb-8 text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed px-4">
                Khám phá tủ đồ trong mơ với những thiết kế váy đầm cao cấp, giúp bạn tỏa sáng trong mọi khoảnh khắc quan trọng.
                </p>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-in-up" delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                <Link
                  href="/products"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-dark text-white px-10 py-5 rounded-full font-black text-lg hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  Bắt Đầu Thuê
                  <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                </Link>
                {!isLoggedIn && (
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-brand-dark px-10 py-5 rounded-full font-black text-lg transition-all border-2 border-brand/30 hover:border-brand-dark shadow-sm"
                  >
                    Tham Gia Ngay
                  </Link>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-brand-dark/30 animate-bounce">
            <div className="w-6 h-10 border-2 border-brand/30 rounded-full flex justify-center p-1">
                <div className="w-1.5 h-1.5 bg-brand-dark rounded-full"></div>
            </div>
        </div>
      </section>

      {/* Features - Meticulous Layout */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { 
                    icon: <TrophyIcon className="w-8 h-8 text-brand-dark" />, 
                    title: "Chất Lượng Cao Cấp", 
                    desc: "Mỗi bộ trang phục đều được kiểm định và chăm sóc tỉ mỉ.",
                    bg: "bg-brand-light/10"
                },
                { 
                    icon: <ClockIcon className="w-8 h-8 text-brand-dark" />, 
                    title: "Dịch Vụ Tận Tâm", 
                    desc: "Hỗ trợ chỉnh sửa số đo và tư vấn phong cách chuyên sâu.",
                    bg: "bg-brand-light/10"
                },
                { 
                    icon: <UserGroupIcon className="w-8 h-8 text-brand-dark" />, 
                    title: "Cộng Đồng MAP", 
                    desc: "Gia nhập cộng đồng phái đẹp yêu thời trang và sự thanh lịch.",
                    bg: "bg-brand-light/10"
                }
            ].map((feature, idx) => (
                <AnimatedSection key={idx} animation="zoom-in" delay={idx * 150}>
                    <div className="bg-white p-8 rounded-[2rem] border border-brand-light/30 h-full flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-16 h-16 ${feature.bg} rounded-3xl flex items-center justify-center mb-6`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">{feature.title}</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                </AnimatedSection>
            ))}
            </div>
        </div>
      </section>

      {/* New Products - 2 Columns on Mobile */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in-right">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 text-center md:text-left gap-6">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-2">
                      New <span className="text-brand-dark">Arrivals</span>
                  </h2>
                  <p className="text-brand font-bold tracking-widest uppercase text-xs">Bộ Sưu Tập Mới Nhất</p>
                </div>
                <Link href="/products" className="group flex items-center gap-2 text-sm font-black text-brand-dark uppercase tracking-widest hover:opacity-70 transition-opacity">
                  Xem tất cả
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
            {loadingProducts ? (
              [1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-[2.5rem]" />)
            ) : newArrivals.map((product, idx) => (
              <AnimatedSection key={product.id} animation="fade-in-up" delay={idx * 100}>
                <ProductCard product={product} badge="New" />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Video Reviews - Elegant Dark Style */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in-left">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                    MAP <span className="text-brand">Moments</span>
                </h2>
                <p className="text-gray-450 text-sm md:text-xl font-medium opacity-60 uppercase tracking-[0.3em]">Khoảnh khắc tỏa sáng cùng khách hàng</p>
            </div>
          </AnimatedSection>
          
          {loadingVideos ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {featuredVideos.map((video, idx) => (
                <AnimatedSection key={video.id} animation="zoom-in" delay={idx * 100}>
                    <button
                    onClick={() => setSelectedVideo(video)}
                    className="group relative block w-full aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-950 border border-white/10"
                    >
                    <div className="absolute inset-0 z-0">
                        {video.thumbnailUrl ? (
                            <img 
                                src={video.thumbnailUrl} 
                                alt={video.productName} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <video
                                src={video.videoUrl}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                muted
                                playsInline
                                preload="metadata"
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                    <PlayIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/70 group-hover:text-white group-hover:scale-125 transition-all z-20 shadow-2xl" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-left bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-wider line-clamp-1">{video.productName}</h3>
                        <p className="text-white/60 text-[10px] uppercase font-bold mt-1">Video Review</p>
                    </div>
                    </button>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Most Rented - Focused 2 columns for mobile */}
      <section className="py-24 bg-brand-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in-down">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-2">
                    Best <span className="text-brand-dark">Sellers</span>
                </h2>
                <p className="text-brand font-bold tracking-widest uppercase text-xs">Được thuê nhiều nhất</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
            {loadingProducts ? (
              [1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-[2.5rem]" />)
            ) : bestSellers.length > 0 ? (
              bestSellers.map((product, idx) => (
                <AnimatedSection key={product.id} animation="fade-in-up" delay={idx * 100}>
                  <ProductCard product={product} badge="Best Seller" badgeColor="bg-brand-dark" />
                </AnimatedSection>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400 font-black uppercase tracking-widest text-xs">
                Đang cập nhật danh sách...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Size Consultation Section - Based on User Request */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-in-down">
                <div className="text-center mb-20 text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-[0.2em]">
                        Tư Vấn Kích Cỡ Trang Phục
                    </h2>
                    <p className="text-brand font-bold tracking-widest uppercase text-xs mt-2">Dịch vụ tận tâm</p>
                </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                    {
                        path: "/images/size_support.png",
                        title: "Hỗ Trợ 24/7",
                        desc: "MAP DRESS luôn sẵn sàng hỗ trợ & tư vấn cho bạn về những mẫu sản phẩm và dịch vụ của cửa hàng."
                    },
                    {
                        path: "/images/size_trends.png",
                        title: "Cập Nhật Xu Hướng",
                        desc: "Những xu hướng thời trang mới, những mẫu sản phẩm & những bst mới sẽ luôn được MAP DRESS nhập về sớm nhất."
                    },
                    {
                        path: "/images/size_fit.png",
                        title: "Kích Cỡ Phù Hợp",
                        desc: "Bạn vẫn đang băn khoăn không biết kích cỡ nào là vừa vặn với bản thân? Đừng lo! Hãy để MAP DRESS giúp bạn!"
                    },
                    {
                        path: "/images/size_team.png",
                        title: "Đội Ngũ Nhân Sự Chuyên Nghiệp",
                        desc: "Với đội ngũ chuyên viên tư vấn đầy kinh nghiệm, MAP DRESS tự tin cung cấp các dịch vụ chất lượng nhất."
                    }
                ].map((item, idx) => (
                    <AnimatedSection key={idx} animation="fade-in-up" delay={idx * 150}>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-full aspect-square rounded-3xl overflow-hidden mb-8 border border-gray-100 shadow-sm transition-transform hover:scale-105 duration-500">
                                <img 
                                    src={item.path} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-tighter">{item.title}</h3>
                            <p className="text-gray-500 text-[10px] font-medium leading-[1.8] px-2">{item.desc}</p>
                        </div>
                    </AnimatedSection>
                ))}
            </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-lg md:max-w-4xl bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-2xl animate-zoom-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-[110] bg-black/50 hover:bg-black p-2 rounded-full transition-colors border border-white/10"
              onClick={() => setSelectedVideo(null)}
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
            
            <div className="w-full aspect-video bg-black">
                <iframe
                src={selectedVideo.videoUrl.includes('youtube.com') 
                    ? selectedVideo.videoUrl.replace('watch?v=', 'embed/') 
                    : selectedVideo.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ></iframe>
            </div>
            
            <div className="p-5 md:p-8 bg-gray-900 flex-shrink-0">
                <h3 className="text-white font-black text-base md:text-2xl uppercase tracking-widest mb-2 line-clamp-2">{selectedVideo.productName}</h3>
                <p className="text-white/50 text-xs md:text-base font-medium line-clamp-3">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
