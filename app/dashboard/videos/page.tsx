'use client'

import { useState, useEffect } from 'react'
import { 
  TrashIcon, 
  VideoCameraIcon, 
  PlusIcon, 
  StarIcon as StarSolid,
  StarIcon as StarOutline,
  XMarkIcon
} from '@heroicons/react/24/outline'
import AdminSidebar from '../../components/AdminSidebar'

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

export default function VideoManagementPage() {
  const [videos, setVideos] = useState<VideoReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    type: 'review' as 'review' | 'feedback',
    video: null as File | null
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos')
      if (res.ok) {
        const data = await res.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured })
      })

      if (res.ok) {
        fetchVideos()
      } else {
        const data = await res.json()
        alert(data.error || 'Lỗi khi cập nhật trạng thái')
      }
    } catch (error) {
      alert('Lỗi kết nối')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa video này?')) return

    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchVideos()
      } else {
        alert('Lỗi khi xóa video')
      }
    } catch (error) {
      alert('Lỗi kết nối')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.video) {
      alert('Vui lòng chọn video')
      return
    }

    setIsUploading(true)
    const data = new FormData()
    data.append('video', formData.video)
    data.append('productName', formData.productName)
    data.append('description', formData.description)
    data.append('type', formData.type)

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        body: data
      })

      if (res.ok) {
        setShowUploadModal(false)
        setFormData({ productName: '', description: '', type: 'review', video: null })
        fetchVideos()
      } else {
        const error = await res.json()
        alert(error.error || 'Lỗi khi tải video lên')
      }
    } catch (error) {
      alert('Lỗi kết nối')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản Lý Video</h1>
            <p className="text-gray-600">Quản lý khoảnh khắc khách hàng và review sản phẩm</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
            Tải Video Mới
          </button>
        </div>

        {/* Video Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Tổng cộng</p>
            <p className="text-3xl font-black text-brand-dark">{videos.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Đang nổi bật</p>
            <p className="text-3xl font-black text-yellow-500">{videos.filter(v => v.featured).length}/4</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Feedback khách</p>
            <p className="text-3xl font-black text-purple-500">{videos.filter(v => v.type === 'feedback').length}</p>
          </div>
        </div>

        {/* Video List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Video</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Thông tin</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Loại</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Nổi bật</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Đang tải...</td>
                </tr>
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Chưa có video nào</td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-20 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative group">
                        <video src={video.videoUrl} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <VideoCameraIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 uppercase text-xs">{video.productName}</div>
                      <div className="text-xs text-gray-500 line-clamp-2 mt-1">{video.description}</div>
                      <div className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{video.createdAt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        video.type === 'review' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {video.type === 'review' ? 'Highlight' : 'Feedback'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleFeatured(video.id, video.featured)}
                        className={`p-2 rounded-lg transition-colors ${
                          video.featured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50'
                        }`}
                      >
                        {video.featured ? <StarSolid className="w-6 h-6 fill-current" /> : <StarOutline className="w-6 h-6" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(video.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl overflow-hidden relative">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
              
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight text-brand-dark">Tải Video Mới</h3>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tên sản phẩm / Khách hàng</label>
                  <input 
                    type="text" 
                    required
                    value={formData.productName}
                    onChange={e => setFormData({...formData, productName: e.target.value})}
                    className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Ví dụ: Váy Dạ Hội Cao Cấp"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Mô tả ngắn</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand min-h-[100px]"
                    placeholder="Nhập mô tả cho video..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Loại video</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                      className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand bg-white"
                    >
                      <option value="review">Highlight Review</option>
                      <option value="feedback">Khách Feedback</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">File Video (Max 50MB)</label>
                    <input 
                      type="file" 
                      accept="video/*"
                      required
                      onChange={e => setFormData({...formData, video: e.target.files?.[0] || null})}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-brand-light file:text-brand-dark hover:file:bg-brand transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-brand-dark text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Đang tải lên...
                      </>
                    ) : 'Bắt đầu tải lên'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
