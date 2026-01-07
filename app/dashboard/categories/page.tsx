'use client'

import { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, FolderIcon } from '@heroicons/react/24/outline'
import AdminSidebar from '../../components/AdminSidebar'

const initialCategories = [
  { id: '1', name: 'Váy Dạ Hội', slug: 'vay-da-hoi', productCount: 15 },
  { id: '2', name: 'Áo Dài', slug: 'ao-dai', productCount: 12 },
  { id: '3', name: 'Vest', slug: 'vest', productCount: 8 },
  { id: '4', name: 'Đầm', slug: 'dam', productCount: 20 },
  { id: '5', name: 'Váy Cưới', slug: 'vay-cuoi', productCount: 10 },
  { id: '6', name: 'Suit', slug: 'suit', productCount: 6 },
  { id: '7', name: 'Đặc Biệt', slug: 'dac-biet', productCount: 5 },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      setCategories(categories.map(c => 
        c.id === editingId 
          ? { ...c, name: formData.name, slug: formData.slug }
          : c
      ))
      setEditingId(null)
    } else {
      setCategories([...categories, {
        id: Date.now().toString(),
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        productCount: 0,
      }])
    }
    
    setIsAdding(false)
    setFormData({ name: '', slug: '' })
  }

  const handleEdit = (category: typeof initialCategories[0]) => {
    setEditingId(category.id)
    setFormData({ name: category.name, slug: category.slug })
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
      setCategories(categories.filter(c => c.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản Lý Danh Mục</h1>
            <p className="text-gray-600">Tổng số: {categories.length} danh mục</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true)
              setEditingId(null)
              setFormData({ name: '', slug: '' })
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            Thêm Danh Mục
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Chỉnh Sửa' : 'Thêm'} Danh Mục</h3>
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2">Tên danh mục *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                  placeholder="Váy Dạ Hội"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                  placeholder="vay-da-hoi"
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                {editingId ? 'Cập nhật' : 'Thêm'}
              </button>
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null) }} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300">
                Hủy
              </button>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FolderIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-600">{category.productCount} sản phẩm</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
