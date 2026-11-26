"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Clock, DollarSign, Shield, Zap } from "lucide-react"

interface MetricProps {
  icon: React.ReactNode
  value: string
  label: string
  description: string
  color: string
  delay: number
}

function AnimatedMetric({ icon, value, label, description, color, delay }: MetricProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    const targetValue = parseInt(value.replace(/[^0-9]/g, ''))
    if (isNaN(targetValue)) return

    const duration = 2000
    const steps = 60
    const increment = targetValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setCount(targetValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  const displayValue = value.includes('%') 
    ? `${count}%` 
    : value.includes('$') 
    ? `$${count}M+` 
    : value.includes('x')
    ? `${count}x`
    : count.toString()

  return (
    <Card 
      className={`border-2 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } hover:shadow-lg hover:scale-105`}
    >
      <CardContent className="p-6 space-y-4">
        <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <div className={`text-4xl font-bold bg-gradient-to-br from-${color} to-${color}/60 bg-clip-text text-transparent mb-2`}>
            {isVisible ? displayValue : '0'}
          </div>
          <div className="text-sm font-bold text-foreground mb-1">{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
        
        {/* Animated progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-${color} to-${color}/60 rounded-full transition-all duration-2000 ease-out`}
            style={{ 
              width: isVisible ? '100%' : '0%',
              transitionDelay: `${delay}ms`
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function BusinessImpactDashboard() {
  return (
    <div className="space-y-8 my-16">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold">Measurable Business Impact</h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Real results from enterprise AI implementations - not just promises
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <AnimatedMetric
          icon={<Clock className="h-6 w-6 text-primary" />}
          value="40%"
          label="Faster Compliance"
          description="Reduce regulatory check time significantly"
          color="primary"
          delay={0}
        />
        
        <AnimatedMetric
          icon={<TrendingUp className="h-6 w-6 text-secondary" />}
          value="30%"
          label="Lower Service Delays"
          description="Improve operational efficiency"
          color="secondary"
          delay={200}
        />
        
        <AnimatedMetric
          icon={<DollarSign className="h-6 w-6 text-accent" />}
          value="$5M+"
          label="Cost Savings"
          description="Average savings in first year"
          color="accent"
          delay={400}
        />
        
        <AnimatedMetric
          icon={<Zap className="h-6 w-6 text-primary" />}
          value="50%"
          label="Faster Collections"
          description="Accelerate cash flow cycles"
          color="primary"
          delay={600}
        />
        
        <AnimatedMetric
          icon={<Shield className="h-6 w-6 text-secondary" />}
          value="100%"
          label="Regulatory Compliance"
          description="Built-in governance and audit trails"
          color="secondary"
          delay={800}
        />
        
        <AnimatedMetric
          icon={<TrendingUp className="h-6 w-6 text-accent" />}
          value="3x"
          label="ROI Growth"
          description="Scale from pilots to 100+ use cases"
          color="accent"
          delay={1000}
        />
      </div>

      {/* Animated benefit callouts */}
      <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-12">
        {[
          { label: "Quick Wins", desc: "2-4 use cases deliver ROI fast", delay: 0 },
          { label: "Future Proof", desc: "Scale to 100+ scenarios", delay: 200 },
          { label: "Lower Risk", desc: "Structured governance", delay: 400 },
          { label: "Enterprise Ready", desc: "Seamless integrations", delay: 600 }
        ].map((item, idx) => (
          <div
            key={idx}
            className="text-center p-4 rounded-lg bg-muted/50 transition-all duration-700 hover:bg-muted"
            style={{
              animation: `fadeInUp 0.7s ease-out ${item.delay}ms both`
            }}
          >
            <div className="font-bold mb-1">{item.label}</div>
            <div className="text-xs text-muted-foreground">{item.desc}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
