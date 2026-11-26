"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"

const impactData = [
  {
    name: "Healthcare",
    compliance: 40,
    serviceDelay: 30,
    fill: "#3b82f6"
  },
  {
    name: "Visa Processing",
    callReduction: 50,
    upsell: 20,
    fill: "#8b5cf6"
  },
  {
    name: "Industrial",
    collections: 25,
    crossSell: 15,
    fill: "#10b981"
  },
  {
    name: "Consumer Brand",
    campaignSpeed: 60,
    fill: "#f59e0b"
  }
]

export function CustomerImpactChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-6xl mx-auto py-8"
    >
      <Card className="border-2">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Customer Impact at a Glance</h3>
            <p className="text-muted-foreground">Measurable improvements across enterprise customers</p>
          </div>
          
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={impactData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  label={{ value: 'Improvement (%)', angle: -90, position: 'insideLeft' }}
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Bar dataKey="compliance" name="Faster Compliance" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="serviceDelay" name="Fewer Delays" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                <Bar dataKey="callReduction" name="Call Reduction" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="upsell" name="Higher Upsell" fill="#a855f7" radius={[8, 8, 0, 0]} />
                <Bar dataKey="collections" name="Faster Collections" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="crossSell" name="Cross-sell Revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="campaignSpeed" name="Campaign Speed" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ImpactMetricsGrid() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const isMobile = useIsMobile()

  // Auto-flip cards on mobile when they enter the viewport
  useEffect(() => {
    if (!isMobile) return

    const observers: IntersectionObserver[] = []

    cardRefs.current.forEach((card, index) => {
      if (!card) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Card entered viewport, flip it
              setFlippedCards((prev) => ({ ...prev, [index]: true }))
            }
          })
        },
        {
          threshold: 0.3, // Trigger when 30% of the card is visible
        }
      )

      observer.observe(card)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [isMobile])

  const metrics = [
    {
      title: "Finance AI",
      icon: "💰",
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500/50",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      textColor: "text-blue-500",
      useCases: [
        "Automated invoice processing",
        "AI-driven forecasting",
        "Intelligent compliance checks",
        "Smart expense management"
      ]
    },
    {
      title: "Operations AI",
      icon: "⚙️",
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500/50",
      bgColor: "from-purple-500/10 to-pink-500/10",
      textColor: "text-purple-500",
      useCases: [
        "Workflow automation",
        "Predictive maintenance",
        "Resource optimization",
        "Quality control AI"
      ]
    },
    {
      title: "Sales AI",
      icon: "📈",
      color: "from-emerald-500 to-green-500",
      borderColor: "border-emerald-500/50",
      bgColor: "from-emerald-500/10 to-green-500/10",
      textColor: "text-emerald-500",
      useCases: [
        "AI sales assistant",
        "Lead scoring & nurturing",
        "Smart CRM nudges",
        "Revenue forecasting"
      ]
    },
    {
      title: "Marketing AI",
      icon: "🎯",
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-500/50",
      bgColor: "from-orange-500/10 to-red-500/10",
      textColor: "text-orange-500",
      useCases: [
        "Campaign intelligence",
        "Content generation",
        "Customer segmentation",
        "Predictive analytics"
      ]
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto py-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          ref={(el) => { cardRefs.current[index] = el }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group perspective-1000 h-[280px]"
        >
          <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
            isMobile 
              ? (flippedCards[index] ? 'rotate-y-180' : '') 
              : 'group-hover:rotate-y-180'
          }`}>
            {/* Front */}
            <Card className={`absolute w-full h-full backface-hidden border-2 border-primary/30 bg-gradient-to-br ${metric.bgColor}`}>
              <CardContent className="p-6 h-full flex flex-col justify-center items-center space-y-4">
                <div className="text-5xl mb-2">
                  {metric.icon}
                </div>
                <h3 className={`text-xl font-bold text-center bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                  {metric.title}
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  Transforming AI Use Cases
                </p>
              </CardContent>
            </Card>
            
            {/* Back */}
            <Card className={`absolute w-full h-full backface-hidden rotate-y-180 border-2 ${metric.borderColor} bg-gradient-to-br ${metric.bgColor}`}>
              <CardContent className="p-5 h-full flex flex-col justify-center space-y-2">
                <h4 className={`text-lg font-bold ${metric.textColor} text-center mb-2`}>
                  AI Use Cases
                </h4>
                <ul className="space-y-2 text-xs">
                  {metric.useCases.map((useCase, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={`${metric.textColor} text-sm mt-0.5`}>•</span>
                      <span className="text-foreground/80 leading-tight">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
