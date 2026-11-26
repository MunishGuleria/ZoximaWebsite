"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Slide {
  image: string
  title: string
  description: string
}

const slides: Slide[] = [
  {
    image: "/industries/slideshow-1.jpg",
    title: "Enterprise AI Transformation",
    description: "Driving measurable ROI through intelligent automation and multi-agentic systems"
  },
  {
    image: "/industries/slideshow-2.jpg",
    title: "Strategic Innovation",
    description: "Empowering teams with cutting-edge AI solutions for competitive advantage"
  },
  {
    image: "/industries/slideshow-3.jpg",
    title: "Data-Driven Excellence",
    description: "Transform insights into action with our advanced analytics and AI capabilities"
  },
  {
    image: "/industries/slideshow-4.jpg",
    title: "Scalable Solutions",
    description: "From pilot to production - AI that grows with your business"
  }
]

export function IndustrySlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isPaused])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div 
      className="relative w-full h-[500px] lg:h-[600px] overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-16">
            <div className="max-w-3xl">
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
                {slide.title}
              </h2>
              <p className="text-xl lg:text-2xl text-white/90 animate-fade-in-delay">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm h-12 w-12 rounded-full"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm h-12 w-12 rounded-full"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white w-8" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
