'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { clsx } from 'clsx'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' | 'zoom-in'
  delay?: number
  threshold?: number
}

export default function AnimatedSection({
  children,
  className,
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1,
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [threshold])

  const getAnimationClass = () => {
    if (!isVisible) {
      switch (animation) {
        case 'fade-in-up': return 'opacity-0 translate-y-10'
        case 'fade-in-down': return 'opacity-0 -translate-y-10'
        case 'fade-in-left': return 'opacity-0 -translate-x-10'
        case 'fade-in-right': return 'opacity-0 translate-x-10'
        case 'zoom-in': return 'opacity-0 scale-95'
        default: return 'opacity-0 translate-y-10'
      }
    }

    return 'opacity-100 translate-x-0 translate-y-0 scale-100'
  }

  return (
    <div
      ref={sectionRef}
      className={clsx(
        'transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)',
        getAnimationClass(),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
