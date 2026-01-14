'use client'

import { useState, useEffect } from 'react'
import { PhotoIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import AdminSidebar from '../../components/AdminSidebar'

interface Banner {
  id: string
  title: string
  imageUrl: string
  link: string | null
  order: number
  active: boolean
}

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [newBanner, setNewBanner] = useState({
    title: '',
    link: '',
    imageUrl: '',
    order: 0,
    active: true
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners')
      if (res.ok) {
        const data = await res.json()
        setBanners(data)
        setNewBanner(prev => ({ ...prev, order: data.length + 1 }))
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const res = await fetch('/api/banners/upload', {
        method: 'POST',
        body: uploadFormData,
      })
      const data = await res.json()
      if (data.url) {
        setNewBanner(prev => ({ ...prev, imageUrl: data.url }))
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Tải ảnh thất bại')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBanner.imageUrl) {
      alert('Vui lòng tải lên hình ảnh banner')
      return
    }

    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner),
      })

      if (res.ok) {
        fetchBanners()
        setIsAdding(false)
        setNewBanner({ 
          title: '', 
          link: '', 
          imageUrl: '', 
          order: banners.length + 2,
          active: true 
        })
      } else {
        const errorData = await res.json()
        alert(`Lỗi khi thêm banner: ${errorData.details || errorData.error}`)
      }
    } catch (error) {
      console.error('Error adding banner:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa banner này?')) {
      try {
        const res = await fetch(`/api/banners/${id}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          fetchBanners()
        }
      } catch (error) {
        console.error('Error deleting banner:', error)
      }
    }
  }

  const toggleActive = async (banner: Banner) => {
    try {
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, active: !banner.active }),
      })
      if (res.ok) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Error updating banner:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản Lý Banner</h1>
          <p className="text-gray-600">Quản lý banner hiển thị trên trang chủ</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          Thêm Banner
        </button>
      </div>

      {/* Add Banner Form */}
      {isAdding && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Thêm Banner Mới</h3>
          <form onSubmit={handleAddBanner} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tiêu đề</label>
              <input
                type="text"
                value={newBanner.title}
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nhập tiêu đề banner"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Link</label>
              <input
                type="text"
                value={newBanner.link}
                onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="/products (Tùy chọn)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Hình ảnh</label>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors relative ${
                  newBanner.imageUrl ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                {newBanner.imageUrl ? (
                  <div className="relative h-48 w-full">
                    <img 
                      src={newBanner.imageUrl} 
                      alt="Preview" 
                      className="h-full w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setNewBanner(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block w-full h-full">
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-purple-600">Đang tải lên...</p>
                      </div>
                    ) : (
                      <>
                        <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600">Click để tải ảnh lên</p>
                        <p className="text-sm text-gray-500">PNG, JPG tối đa 5MB</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Thêm Banner
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 text-center py-10">Đang tải...</div>
        ) : banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl shadow-md overflow-hidden group">
            {/* Banner Preview */}
            <div className="aspect-[16/6] bg-gray-100 relative items-center justify-center overflow-hidden">
               {banner.imageUrl ? (
                 <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
               ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-4xl">🖼️</span>
                </div>
               )}
              
              {!banner.active && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Đã tắt</span>
                </div>
              )}
            </div>

            {/* Banner Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{banner.title}</h3>
                  <p className="text-sm text-gray-600">Link: {banner.link || 'Không có'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                      banner.active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {banner.active ? 'Đang bật' : 'Đã tắt'}
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && banners.length === 0 && !isAdding && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <PhotoIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Chưa có banner nào</p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Thêm Banner Đầu Tiên
          </button>
        </div>
      )}
      </main>
    </div>
  )
}
