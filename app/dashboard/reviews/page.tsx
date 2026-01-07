'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, VideoCameraIcon, StarIcon, EyeIcon, XMarkIcon, PlayIcon, CheckIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import AdminSidebar from '../../components/AdminSidebar'

interface VideoReview {
  id: string
  productName: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  featured: boolean
  type: 'review' | 'feedback'  // Review sản phẩm hoặc Feedback khách hàng
  createdAt: string
}

const mockVideos: VideoReview[] = [
  {
    id: '1',
    productName: 'Váy Dạ Hội Sang Trọng',
    description: 'Review chi tiết về chất liệu và kiểu dáng của váy dạ hội cao cấp',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    featured: true,
    type: 'review',
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    productName: 'Áo Dài Truyền Thống',
    description: 'Feedback của khách hàng Nguyễn Thị Lan về trải nghiệm thuê áo dài',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    featured: true,
    type: 'feedback',
    createdAt: '2024-01-18'
  }
]

export default function VideoReviewsManagementPage() {
  const [videos, setVideos] = useState<VideoReview[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [viewingVideo, setViewingVideo] = useState<VideoReview | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    type: 'review' as 'review' | 'feedback',
  })

  // Fetch videos from API on mount
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
    }
  }

  const featuredCount = videos.filter(v => v.featured).length

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Video quá lớn. Kích thước tối đa là 50MB.')
      return
    }

    // Check file type
    if (!file.type.startsWith('video/')) {
      alert('Vui lòng chọn file video (MP4, MOV, etc.)')
      return
    }

    setUploadedFile(file)
    const preview = URL.createObjectURL(file)
    setUploadPreview(preview)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!uploadedFile) {
      alert('Vui lòng chọn video!')
      return
    }

    setUploading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('video', uploadedFile)
      formDataToSend.append('productName', formData.productName)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('type', formData.type)

      const response = await fetch('/api/videos', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        const newVideo = await response.json()
        setVideos([newVideo, ...videos])
        setIsAdding(false)
        setFormData({ productName: '', description: '', type: 'review' })
        setUploadedFile(null)
        if (uploadPreview) URL.revokeObjectURL(uploadPreview)
        setUploadPreview(null)
        alert('Upload thành công!')
      } else {
        const error = await response.json()
        alert(`Lỗi: ${error.error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Có lỗi xảy ra khi upload video')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa video này?')) return

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setVideos(videos.filter(v => v.id !== id))
        alert('Xóa thành công!')
      } else {
        alert('Có lỗi xảy ra khi xóa video')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Có lỗi xảy ra khi xóa video')
    }
  }

  const toggleFeatured = async (id: string) => {
    const video = videos.find(v => v.id === id)
    if (!video) return

    if (!video.featured && featuredCount >= 4) {
      alert('Chỉ có thể chọn tối đa 4 video featured cho trang chủ!')
      return
    }

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !video.featured }),
      })

      if (response.ok) {
        const updatedVideo = await response.json()
        setVideos(videos.map(v => v.id === id ? updatedVideo : v))
      } else {
        const error = await response.json()
        alert(`Lỗi: ${error.error}`)
      }
    } catch (error) {
      console.error('Toggle featured error:', error)
      alert('Có lỗi xảy ra')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản Lý Video Reviews</h1>
            <p className="text-gray-600">
              Tổng số: {videos.length} videos | Featured: {featuredCount}/4
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            Thêm Video
          </button>
        </div>

        {/* Add Video Form */}
        {isAdding && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Thêm Video Review Mới</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Váy Dạ Hội Sang Trọng"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Mô tả *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Mô tả ngắn gọn về video review này..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Loại video *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'review' | 'feedback' })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="review">Review Sản Phẩm (từ shop)</option>
                  <option value="feedback">Feedback Khách Hàng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Upload Video *</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <VideoCameraIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium">
                    {uploadedFile ? uploadedFile.name : 'Click để chọn video'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    MP4, MOV, AVI - Tối đa 50MB
                  </p>
                </label>

                {uploadPreview && (
                  <div className="mt-4">
                    <video
                      src={uploadPreview}
                      controls
                      className="w-full max-h-64 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    uploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {uploading ? 'Đang upload...' : 'Thêm Video'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false)
                    setUploadedFile(null)
                    if (uploadPreview) URL.revokeObjectURL(uploadPreview)
                    setUploadPreview(null)
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Video Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-purple-200 to-pink-200 relative group">
                <video
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  poster={video.thumbnailUrl}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setViewingVideo(video)}
                    className="bg-white/90 hover:bg-white rounded-full p-4 transition-colors"
                  >
                    <PlayIcon className="w-8 h-8 text-purple-600" />
                  </button>
                </div>
                {video.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <StarIconSolid className="w-4 h-4" />
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{video.productName}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                <p className="text-xs text-gray-500 mb-3">{video.createdAt}</p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(video.id)}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      video.featured
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={video.featured ? 'Bỏ featured' : 'Đặt làm featured'}
                  >
                    {video.featured ? (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        Featured
                      </>
                    ) : (
                      <>
                        <StarIcon className="w-4 h-4" />
                        Feature
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setViewingVideo(video)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Xem video"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa video"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <VideoCameraIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 mb-2">Chưa có video nào</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Thêm Video Đầu Tiên
            </button>
          </div>
        )}

        {/* Video View Modal */}
        {viewingVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewingVideo(null)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{viewingVideo.productName}</h2>
                    <p className="text-gray-600">{viewingVideo.description}</p>
                  </div>
                  <button
                    onClick={() => setViewingVideo(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <video
                  src={viewingVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full rounded-lg"
                />

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    viewingVideo.featured
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {viewingVideo.featured ? '⭐ Featured' : 'Video Review'}
                  </span>
                  <p className="text-sm text-gray-500">{viewingVideo.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
