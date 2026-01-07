'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline'
import AdminSidebar from '../../components/AdminSidebar'

const categories = ['Váy Dạ Hội', 'Áo Dài', 'Vest', 'Đầm', 'Váy Cưới', 'Suit', 'Đặc Biệt']

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    categoryName: categories[0],
    description: '',
    price: '',
    stock: '',
    colors: '',
    images: [] as string[],
  })
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
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
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        body: uploadFormData,
      })
      const data = await res.json()
      if (data.url) {
        setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }))
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Tải ảnh thất bại')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/products'
      const method = editingId ? 'PATCH' : 'POST' // Note: Patch not yet in API but preparing
      
      const res = await fetch(url, {
        method: 'POST', // For simplicity right now only POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchProducts()
        setIsAdding(false)
        setEditingId(null)
        setFormData({ name: '', categoryName: categories[0], description: '', price: '', stock: '', colors: '', images: [] })
      } else {
        const errorData = await res.json()
        alert(`Có lỗi xảy ra: ${errorData.details || errorData.error || 'Lỗi không xác định'}`)
      }
    } catch (error: any) {
      console.error('Save failed:', error)
      alert(`Lỗi kết nối: ${error.message}`)
    }
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      categoryName: product.category?.name || categories[0],
      description: product.description || '',
      price: product.dailyPrice.toString(),
      stock: product.stock.toString(),
      colors: product.colors?.map((c:any) => c.value).join(', ') || '',
      images: product.images?.map((img:any) => img.url) || [],
    })
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản Lý Sản Phẩm</h1>
          <p className="text-gray-600">Tổng số: {products.length} sản phẩm</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
            setFormData({ name: '', categoryName: categories[0], description: '', price: '', stock: '', colors: '', images: [] })
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          Thêm Sản Phẩm
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{editingId ? 'Chỉnh Sửa' : 'Thêm'} Sản Phẩm</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tên sản phẩm *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Váy Dạ Hội..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Danh mục *</label>
              <select
                value={formData.categoryName}
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Giá thuê/ngày (VNĐ) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="500000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Số lượng *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Màu sắc (cách nhau bởi dấu phẩy)</label>
              <input
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Đỏ, Đen, Trắng"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Mô tả sản phẩm..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Hình ảnh</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={url} alt="Product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-400 transition-colors cursor-pointer group">
                  {isUploading ? (
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <PhotoIcon className="w-8 h-8 text-gray-400 group-hover:text-purple-400" />
                      <span className="text-xs text-gray-500 mt-2">Tải ảnh</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                {editingId ? 'Cập nhật' : 'Thêm'} sản phẩm
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setEditingId(null)
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sản phẩm</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Danh mục</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Giá/ngày</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Số lượng</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500 uppercase tracking-widest text-xs font-black">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500 uppercase tracking-widest text-xs font-black">
                  Chưa có sản phẩm nào
                </td>
              </tr>
            ) : products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                      {product.images?.[0] ? (
                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">👗</span>
                      )}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category?.name}</td>
                <td className="px-6 py-4 text-purple-600 font-semibold">{formatCurrency(product.dailyPrice)}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <select
                    value={product.status}
                    onChange={(e) => handleStatusChange(product.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                      product.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                      product.status === 'RENTED' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}
                  >
                    <option value="AVAILABLE">Có sẵn</option>
                    <option value="RENTED">Đang thuê</option>
                    <option value="REPAIRING">Đang sửa</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </main>
    </div>
  )
}
