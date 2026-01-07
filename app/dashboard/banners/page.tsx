'use client'

import { useState } from 'react'
import { PhotoIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import AdminSidebar from '../../components/AdminSidebar'

const mockBanners = [
  {
    id: '1',
    title: 'Banner Trang Chủ',
    imageUrl: null,
    link: '/',
    order: 1,
    active: true,
  },
  {
    id: '2',
    title: 'Banner Sản Phẩm Mới',
    imageUrl: null,
    link: '/products',
    order: 2,
    active: true,
  },
]

export default function BannerManagementPage() {
  const [banners, setBanners] = useState(mockBanners)
  const [isAdding, setIsAdding] = useState(false)
  const [newBanner, setNewBanner] = useState({
    title: '',
    link: '',
    order: banners.length + 1,
  })

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault()
    const banner = {
      id: Date.now().toString(),
      ...newBanner,
      imageUrl: null,
      active: true,
    }
    setBanners([...banners, banner])
    setIsAdding(false)
    setNewBanner({ title: '', link: '', order: banners.length + 2 })
  }

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa banner này?')) {
      setBanners(banners.filter(b => b.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setBanners(banners.map(b => 
      b.id === id ? { ...b, active: !b.active } : b
    ))
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
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="/products"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Hình ảnh</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Click để tải ảnh lên</p>
                <p className="text-sm text-gray-500">PNG, JPG tối đa 5MB</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Banner Preview */}
            <div className="aspect-[16/6] bg-gradient-to-br from-purple-200 to-pink-200 relative flex items-center justify-center">
              <span className="text-6xl">🎨</span>
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
                  <p className="text-sm text-gray-600">Link: {banner.link}</p>
                  <p className="text-sm text-gray-600">Thứ tự: {banner.order}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(banner.id)}
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

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-semibold hover:bg-purple-100 transition-colors">
                  Chỉnh sửa
                </button>
                <button className="flex-1 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                  Đổi ảnh
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
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
