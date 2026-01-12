'use client'

import Link from 'next/link'
import { SparklesIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  category?: { name: string } | string
  dailyPrice?: number
  price?: number
  rentals?: number
  rentalCount?: number
  images?: { url: string }[]
  image?: string | null
}

interface ProductCardProps {
  product: Product
  badge?: string
  badgeColor?: string
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

export default function ProductCard({ product, badge, badgeColor = 'bg-brand' }: ProductCardProps) {
  const displayCategory = typeof product.category === 'object' && product.category !== null 
    ? (product.category as any).name 
    : (product.category || 'Chưa phân loại')
  const displayPrice = Number(product.dailyPrice || product.price || 0)
  const displayRentals = product.rentalCount || product.rentals
  const displayImage = product.images?.[0]?.url || product.image

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
    >
      {/* Image Container with Hover Effects */}
      <div className="aspect-[3/4] bg-brand-light/10 relative overflow-hidden flex items-center justify-center">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="relative transform transition-transform duration-700 group-hover:scale-110">
            <span className="text-7xl drop-shadow-xl filter grayscale-[0.2]">👗</span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div className={`absolute top-4 left-4 ${badgeColor} text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500`}>
            {badge}
          </div>
        )}

        {/* Quick View Overlay - Mobile friendly (more subtle on touch) */}
        <div className="absolute inset-0 bg-brand-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full font-black text-xs text-brand-dark uppercase tracking-widest shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-500">
                Xem Chi Tiết
            </div>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <div className="flex justify-between items-center gap-2 mb-2">
            <span className="text-[10px] text-brand-dark font-black tracking-widest uppercase truncate flex-1">
                {displayCategory}
            </span>
            {displayRentals && (
                <span className="text-[9px] bg-brand-light/20 text-brand-dark px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                    {displayRentals} thuê
                </span>
            )}
        </div>
        <h3 className="font-bold text-base md:text-lg text-gray-800 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] group-hover:text-brand-dark transition-colors duration-300 mb-3 leading-tight tracking-tight">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline gap-1.5 overflow-hidden">
                <p className="text-brand-dark font-black text-[12px] md:text-xl leading-none whitespace-nowrap">
                    {formatCurrency(displayPrice)}
                </p>
                <span className="text-[9px] font-black text-gray-400 uppercase whitespace-nowrap">/ ngày</span>
            </div>
        </div>
      </div>
    </Link>
  )
}
