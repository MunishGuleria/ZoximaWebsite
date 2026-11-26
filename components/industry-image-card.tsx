"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface IndustryImageCardProps {
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
  image: string
  approach: string[]
  value: string[]
  gradient: string
  slug?: string
}

export function IndustryImageCard({
  icon: Icon,
  title,
  subtitle,
  description,
  image,
  approach,
  value,
  gradient,
  slug
}: IndustryImageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isExpanded) {
    return (
      <Card className="border-2 overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <CardContent className="p-0">
          {/* Header with close button */}
          <div className="relative h-48 lg:h-64">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white">{title}</h3>
                <p className="text-white/80">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8">
            <div className="mb-6">
              <p className="text-muted-foreground leading-relaxed text-base">
                {description}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Our Approach */}
              <div>
                <h4 className="text-xl font-bold mb-4">Our Approach</h4>
                <div className="space-y-3">
                  {approach.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex-shrink-0 mt-2"></div>
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Value Delivered */}
              <div>
                <h4 className="text-xl font-bold mb-4">Value Delivered</h4>
                <div className="space-y-3">
                  {value.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="group border-2 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      onClick={() => setIsExpanded(true)}
    >
      <CardContent className="p-0">
        <div className="relative h-80 lg:h-96">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${image})` }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:from-black/95 group-hover:via-black/70 transition-all duration-300" />
          
          {/* Content */}
          <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-white/70 font-medium">{subtitle}</p>
              </div>
            </div>
            
            <p className="text-white/90 leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
              {description}
            </p>
            
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center text-white font-medium group-hover:text-purple-200 transition-colors duration-300">
                Click to explore
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
              {slug && (
                <Link href={`/industries/${slug}`}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Full Page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
