'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import AnimatedSection from './AnimatedSection'

const slides = [
  {
      path: "/images/size_support.png",
      title: "Hỗ Trợ 24/7",
      desc: "MAP DRESS luôn sẵn sàng hỗ trợ & tư vấn cho bạn về những mẫu sản phẩm và dịch vụ của cửa hàng."
  },
  {
      path: "/images/size_trends.png",
      title: "Cập Nhật Xu Hướng",
      desc: "Những xu hướng thời trang mới, những mẫu sản phẩm & những bst mới sẽ luôn được MAP DRESS nhập về sớm nhất."
  },
  {
      path: "/images/size_fit.png",
      title: "Kích Cỡ Phù Hợp",
      desc: "Bạn vẫn đang băn khoăn không biết kích cỡ nào là vừa vặn với bản thân? Đừng lo! Hãy để MAP DRESS giúp bạn!"
  },
  {
      path: "/images/size_team.png",
      title: "Đội Ngũ Nhân Sự Chuyên Nghiệp",
      desc: "Với đội ngũ chuyên viên tư vấn đầy kinh nghiệm, MAP DRESS tự tin cung cấp các dịch vụ chất lượng nhất."
  }
]

export default function SizeGuideGallery() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextSlide = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Auto slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
            
          {/* Background/Slide */}
          <div className="absolute inset-0">
            {slides.map((slide, idx) => {
                if (idx !== current) return null
                return (
                    <div 
                        key={idx} 
                        className="absolute inset-0 w-full h-full animate-fade-in"
                    >
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        <img 
                            src={slide.path} 
                            alt={slide.title} 
                            className="w-full h-full object-cover object-center transform transition-transform duration-[10s] hover:scale-110"
                        />
                        
                        {/* Content */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-4">
                            <div className="max-w-3xl mx-auto text-white space-y-4 md:space-y-6">
                                <AnimatedSection key={`title-${idx}`} animation="fade-in-down">
                                    <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-2 md:mb-4 drop-shadow-2xl">
                                        {slide.title}
                                    </h2>
                                </AnimatedSection>
                                <AnimatedSection key={`desc-${idx}`} animation="fade-in-up" delay={200}>
                                    <p className="text-sm md:text-xl font-medium leading-relaxed max-w-xl mx-auto drop-shadow-lg opacity-90">
                                        {slide.desc}
                                    </p>
                                </AnimatedSection>
                            </div>
                        </div>
                    </div>
                )
            })}
          </div>

          {/* Navigation */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-4 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md transition-all text-white border border-white/20 translate-x-[-200%] group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeftIcon className="w-5 h-5 md:w-8 md:h-8" />
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-4 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md transition-all text-white border border-white/20 translate-x-[200%] group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
          >
            <ChevronRightIcon className="w-5 h-5 md:w-8 md:h-8" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {slides.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                        current === idx ? 'bg-white w-6 md:w-8' : 'bg-white/50 hover:bg-white/80'
                    }`}
                />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
