'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PlayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface VideoReview {
  id: string
  productName: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  type: 'review' | 'feedback'
  createdAt: string
}

// Mock data - in production, fetch from API/database
const mockVideos: VideoReview[] = [
  {
    id: '1',
    productName: 'Váy Dạ Hội Sang Trọng',
    description: 'Review chi tiết về chất liệu và kiểu dáng của váy dạ hội cao cấp. Sản phẩm được làm từ chất liệu cao cấp.',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'review',
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    productName: 'Áo Dài Truyền Thống',
    description: 'Hướng dẫn phối đồ và bảo quản áo dài truyền thống Việt Nam',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'review',
    createdAt: '2024-01-18'
  },
  {
    id: '3',
    productName: 'Feedback - Nguyễn Thị Lan',
    description: 'Cảm nhận của khách hàng về trải nghiệm thuê váy cưới tại shop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'feedback',
    createdAt: '2024-01-15'
  },
  {
    id: '4',
    productName: 'Feedback - Trần Văn Minh',
    description: 'Chia sẻ về dịch vụ và chất lượng sản phẩm',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'feedback',
    createdAt: '2024-01-10'
  }
]

export default function ReviewsPage() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'review' | 'feedback'>('review')
  const [videos, setVideos] = useState<VideoReview[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch videos from API
  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const reviewVideos = videos.filter(v => v.type === 'review')
  const feedbackVideos = videos.filter(v => v.type === 'feedback')
  const currentVideos = activeTab === 'review' ? reviewVideos : feedbackVideos

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-light hover:text-white mb-4 text-xs font-black uppercase tracking-widest border-b border-brand-light/30 pb-1 transition-all">
            <ArrowLeftIcon className="w-4 h-4" />
            Trở về cửa hàng
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">MAP <span className="text-brand">MOMENTS</span></h1>
          <p className="text-white/60 text-sm md:text-lg uppercase tracking-[0.3em] font-medium">Khoảnh khắc tỏa sáng cùng khách hàng</p>
        </div>
      </div>

      {/* Tabs - Elegant Style */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-20 z-10 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-8">
            <button
              onClick={() => setActiveTab('review')}
              className={`py-6 px-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border-b-2 transition-all ${
                activeTab === 'review'
                  ? 'border-brand-dark text-brand-dark'
                  : 'border-transparent text-gray-400 hover:text-brand-dark hover:opacity-100'
              }`}
            >
              Phim Review ({reviewVideos.length})
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-6 px-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border-b-2 transition-all ${
                activeTab === 'feedback'
                  ? 'border-brand-dark text-brand-dark'
                  : 'border-transparent text-gray-400 hover:text-brand-dark hover:opacity-100'
              }`}
            >
              Khách Feedback ({feedbackVideos.length})
            </button>
          </div>
        </div>
      </div>

      {/* Videos Grid - Responsive columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : currentVideos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {currentVideos.map((video) => (
              <div key={video.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-brand-light/20 overflow-hidden hover:shadow-xl transition-all duration-500">
                {/* Video Player */}
                <div className="aspect-[3/4] bg-brand-light/10 relative overflow-hidden">
                  {playingVideo === video.id ? (
                    <video
                      src={video.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      {video.thumbnailUrl ? (
                          <img 
                          src={video.thumbnailUrl} 
                          alt={video.productName}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                      ) : (
                          <div className="absolute inset-0 bg-brand-light/20 flex flex-col items-center justify-center p-6 text-center">
                              <PlayIcon className="w-12 h-12 text-brand-dark/20 mb-4" />
                          </div>
                      )}
                      <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-brand-dark/30 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => setPlayingVideo(video.id)}
                          className="bg-white/95 text-brand-dark rounded-full p-4 shadow-xl transform scale-90 group-hover:scale-100 transition-all active:scale-95"
                        >
                          <PlayIcon className="w-8 h-8" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-dark bg-brand-light/30 px-2 py-0.5 rounded-full">
                      {video.type === 'review' ? 'Highlight' : 'Feedback'}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-black text-gray-800 line-clamp-1 group-hover:text-brand-dark transition-colors uppercase tracking-tight">{video.productName}</h3>
                  <p className="text-gray-500 text-[10px] mt-2 line-clamp-2 font-medium leading-relaxed">{video.description}</p>
                  <div className="mt-4 pt-4 border-t border-brand-light/10 flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Date: {video.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-brand-light/20 p-20 text-center">
            <p className="text-xl font-black text-gray-300 uppercase tracking-widest">
              Không có {activeTab === 'review' ? 'Phim' : 'Feedback'} nào
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
