'use client'

import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import ProductCard from '../components/ProductCard'

const mockProducts = [
  { id: '1', name: 'Váy Dạ Hội Sang Trọng Đính Đá', category: 'Váy Dạ Hội', price: 500000, rentals: 45 },
  { id: '2', name: 'Áo Dài Truyền Thống Thêu Hoa', category: 'Áo Dài', price: 300000, rentals: 32 },
  { id: '3', name: 'Vest Nam Công Sở Cao Cấp', category: 'Vest', price: 400000, rentals: 28 },
  { id: '4', name: 'Đầm Dự Tiệc Trễ Vai Quyến Rũ', category: 'Đầm', price: 350000, rentals: 56 },
  { id: '5', name: 'Váy Cưới Đuôi Cá Phối Ren', category: 'Váy Cưới', price: 2000000, rentals: 145 },
  { id: '6', name: 'Suit Nam Lịch Lãm 3 Mảnh', category: 'Suit', price: 800000, rentals: 138 },
  { id: '7', name: 'Kimono Họa Tiết Hoa Đào', category: 'Đặc Biệt', price: 1200000, rentals: 132 },
  { id: '8', name: 'Hanbok Cách Tân Hiện Đại', category: 'Đặc Biệt', price: 900000, rentals: 128 },
]

const categories = ['Tất cả', 'Váy Dạ Hội', 'Áo Dài', 'Vest', 'Đầm', 'Váy Cưới', 'Suit', 'Đặc Biệt']

const priceRanges = [
  { label: 'Tất cả giá', min: 0, max: Infinity },
  { label: 'Dưới 500k', min: 0, max: 500000 },
  { label: '500k - 1M', min: 500000, max: 1000000 },
  { label: '1M - 2M', min: 1000000, max: 2000000 },
  { label: 'Trên 2M', min: 2000000, max: Infinity },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState('newest')
  const [isFilterVisible, setIsFilterVisible] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch('/api/products')
      const data = await res.json()
      
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        console.error('API did not return an array:', data)
        setProducts([])
        setError(data.error || 'Dữ liệu không hợp lệ')
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Không thể kết nối với máy chủ')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(p => p.category?.name === selectedCategory)
    }

    const priceRange = priceRanges[selectedPriceRange]
    filtered = filtered.filter(p => p.dailyPrice >= priceRange.min && p.dailyPrice < priceRange.max)

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.dailyPrice - b.dailyPrice); break
      case 'price-high': filtered.sort((a, b) => b.dailyPrice - a.dailyPrice); break
      default: break
    }

    return filtered
  }, [products, selectedCategory, selectedPriceRange, sortBy])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-60 mb-4 block">Collection</span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">MAP <span className="text-brand">DRESSES</span></h1>
            <div className="flex justify-center">
                <Link href="/" className="text-xs font-bold border-b border-brand-light/30 pb-1 hover:border-white transition-all uppercase tracking-widest text-brand-light">
                    ← Back to Home
                </Link>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6">
          {/* Collapsible Filter Bar */}
          <div className="bg-white rounded-3xl shadow-sm border border-brand-light/20 overflow-hidden">
            <button 
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-brand-light/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <FunnelIcon className="w-5 h-5 text-brand-dark" />
                    <span className="font-black text-xs uppercase tracking-widest text-brand-dark">Bộ Lọc Thông Minh</span>
                    { (selectedCategory !== 'Tất cả' || selectedPriceRange !== 0) && (
                        <span className="w-2 h-2 bg-brand rounded-full animate-pulse"></span>
                    )}
                </div>
                {isFilterVisible ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
            </button>

            <div className={`transition-all duration-500 ease-in-out ${isFilterVisible ? 'max-h-[1000px] opacity-100 border-t border-brand-light/10' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Categories */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Danh mục</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-brand-dark text-white'
                                            : 'bg-gray-50 text-gray-500 hover:bg-brand-light/20 hover:text-brand-dark'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Khoảng giá</label>
                        <div className="flex flex-wrap gap-2">
                            {priceRanges.map((range, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedPriceRange(index)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                        selectedPriceRange === index
                                            ? 'bg-brand-dark text-white'
                                            : 'bg-gray-50 text-gray-500 hover:bg-brand-light/20 hover:text-brand-dark'
                                    }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort & Reset */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Sắp xếp & Xóa</label>
                        <div className="space-y-4">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-brand"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="price-low">Giá thấp → cao</option>
                                <option value="price-high">Giá cao → thấp</option>
                            </select>
                            {(selectedCategory !== 'Tất cả' || selectedPriceRange !== 0) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory('Tất cả')
                                        setSelectedPriceRange(0)
                                    }}
                                    className="w-full py-3 bg-brand/10 text-brand-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand/20 transition-colors"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex-1 mt-6">
            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold border border-red-100">
                Lỗi: {error}. Vui lòng thử lại sau.
              </div>
            )}

            <div className="mb-8 flex items-center justify-between px-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                Hiển thị <span className="text-brand-dark">{filteredProducts.length}</span> thiết kế
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-brand-light/20">
                <p className="text-xl font-black text-gray-300 uppercase tracking-widest">Không có dữ liệu</p>
                <button 
                  onClick={() => {setSelectedCategory('Tất cả'); setSelectedPriceRange(0)}}
                  className="mt-4 text-brand-dark font-black text-[10px] uppercase border-b-2 border-brand"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
