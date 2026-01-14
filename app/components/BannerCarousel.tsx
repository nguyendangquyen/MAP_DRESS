'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface Banner {
  id: string
  title: string
  imageUrl: string
  link: string | null
}

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(timer)
  }, [banners.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  return (
    <div className="relative h-[70vh] w-full overflow-hidden bg-gray-900">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
             <img 
               src={banner.imageUrl} 
               alt={banner.title} 
               className="h-full w-full object-cover"
             />
             <div className="absolute inset-0 bg-black/30 md:bg-black/20" /> {/* Overlay */}
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
            <div className={`transform transition-all duration-1000 delay-300 ${
              index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <span className="inline-block py-2 px-6 rounded-full glass-morphism text-white font-black text-[10px] md:text-xs tracking-[0.3em] uppercase mb-6 border border-white/20">
                New Collection
              </span>
              <h2 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter max-w-4xl leading-tight">
                {banner.title}
              </h2>
              
              {banner.link ? (
                <Link
                  href={banner.link}
                  className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm md:text-lg hover:bg-brand hover:text-white transition-all transform hover:scale-105"
                >
                  Khám Phá Ngay
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm md:text-lg hover:bg-brand hover:text-white transition-all transform hover:scale-105"
                 >
                   Khám Phá Ngay
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white transition-all hidden md:block"
      >
        <ChevronLeftIcon className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white transition-all hidden md:block"
      >
        <ChevronRightIcon className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-10 h-3 bg-white' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
