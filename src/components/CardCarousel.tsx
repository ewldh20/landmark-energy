import { useState, useRef, useEffect } from 'react'
import './CardCarousel.css'

interface CardCarouselProps {
  children: React.ReactNode[]
  className?: string
}

const CardCarousel = ({ children, className = '' }: CardCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const goToSlide = (index: number) => {
    if (index < 0) index = 0
    if (index >= children.length) index = children.length - 1
    setCurrentIndex(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0))
    setScrollLeft(carouselRef.current?.scrollLeft || 0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.touches[0].pageX - (carouselRef.current.offsetLeft || 0)
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    if (!carouselRef.current || !isDragging) return
    setIsDragging(false)
    
    // Determine which card to snap to based on scroll position
    const cardWidth = carouselRef.current.offsetWidth
    const scrollLeft = carouselRef.current.scrollLeft
    const newIndex = Math.round(scrollLeft / cardWidth)
    goToSlide(newIndex)
  }

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: currentIndex * carouselRef.current.offsetWidth,
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  return (
    <div className={`card-carousel-wrapper ${className}`}>
      <div
        ref={carouselRef}
        className="card-carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children.map((child, index) => (
          <div key={index} className="carousel-card">
            {child}
          </div>
        ))}
      </div>
      
      {/* Dots indicator for mobile */}
      <div className="carousel-dots">
        {children.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default CardCarousel
