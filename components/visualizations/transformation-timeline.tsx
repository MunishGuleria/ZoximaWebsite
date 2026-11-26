"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Rocket, TrendingUp, Network, Sparkles } from "lucide-react"

interface TimelinePhase {
  week: string
  title: string
  description: string
  benefits: string[]
  icon: React.ReactNode
  color: string
  isHighlight?: boolean
}

const phases: TimelinePhase[] = [
  {
    week: "Week 1-2",
    title: "Quick Wins",
    description: "Deploy 2-4 high-impact AI use cases",
    benefits: ["Immediate ROI visible", "Pilot to production", "Stakeholder buy-in"],
    icon: <Rocket className="h-6 w-6" />,
    color: "primary",
    isHighlight: true
  },
  {
    week: "Week 3-6",
    title: "Scale Foundation",
    description: "MCP architecture enables rapid expansion",
    benefits: ["10+ use cases live", "Process optimization", "Team training complete"],
    icon: <Network className="h-6 w-6" />,
    color: "secondary"
  },
  {
    week: "Week 7-12",
    title: "Enterprise Adoption",
    description: "Organization-wide AI transformation",
    benefits: ["25+ workflows automated", "Cross-functional integration", "Measurable KPI impact"],
    icon: <TrendingUp className="h-6 w-6" />,
    color: "accent"
  },
  {
    week: "Month 3+",
    title: "Continuous Innovation",
    description: "Scale to 100+ use cases without limits",
    benefits: ["Self-service AI for teams", "Ongoing optimization", "Competitive advantage"],
    icon: <Sparkles className="h-6 w-6" />,
    color: "primary",
    isHighlight: true
  }
]

function TimelinePhaseCard({ phase, index, isVisible }: { phase: TimelinePhase; index: number; isVisible: boolean }) {
  return (
    <div className="relative">
      {/* Connecting line */}
      {index < phases.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-muted to-transparent -translate-y-1/2 z-0">
          <div 
            className={`h-full bg-gradient-to-r from-${phase.color} to-${phase.color}/60 transition-all duration-1000 ease-out`}
            style={{ 
              width: isVisible ? '100%' : '0%',
              transitionDelay: `${index * 300 + 500}ms`
            }}
          />
        </div>
      )}

      <Card 
        className={`relative z-10 border-2 transition-all duration-700 hover:shadow-xl hover:scale-105 ${
          phase.isHighlight ? `border-${phase.color}/50 bg-gradient-to-br from-${phase.color}/5 to-${phase.color}/10` : ''
        } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: `${index * 300}ms` }}
      >
        <CardContent className="p-6 space-y-4">
          {/* Week badge */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full bg-${phase.color}/10 text-${phase.color} text-xs font-bold`}>
              {phase.week}
            </span>
            {phase.isHighlight && (
              <span className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 text-xs font-bold">
                KEY MILESTONE
              </span>
            )}
          </div>

          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl bg-${phase.color}/10 flex items-center justify-center text-${phase.color}`}>
            {phase.icon}
          </div>

          {/* Title and description */}
          <div>
            <h4 className="text-lg font-bold mb-2">{phase.title}</h4>
            <p className="text-sm text-muted-foreground">{phase.description}</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            {phase.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className={`h-4 w-4 text-${phase.color} shrink-0 mt-0.5`} />
                <span className="text-xs text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function TransformationTimeline() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-12 my-16">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold">Your AI Transformation Journey</h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          From pilot to enterprise scale in weeks, not years — with measurable value at every step
        </p>
      </div>

      {/* Timeline phases */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {phases.map((phase, index) => (
          <TimelinePhaseCard 
            key={index} 
            phase={phase} 
            index={index} 
            isVisible={isVisible}
          />
        ))}
      </div>

      {/* Bottom metrics */}
      <div className={`max-w-5xl mx-auto mt-16 transition-all duration-700 delay-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <Card className="border-2 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">3-8</div>
                <div className="text-sm font-medium mb-1">Weeks to Launch</div>
                <div className="text-xs text-muted-foreground">First value delivery</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">2-4</div>
                <div className="text-sm font-medium mb-1">Initial Use Cases</div>
                <div className="text-xs text-muted-foreground">Quick ROI proof</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">100+</div>
                <div className="text-sm font-medium mb-1">Scalable Scenarios</div>
                <div className="text-xs text-muted-foreground">Same foundation</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm font-medium mb-1">Growth Potential</div>
                <div className="text-xs text-muted-foreground">No architectural limits</div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50 text-center">
              <p className="text-sm font-medium text-foreground">
                <span className="text-primary font-bold">The MCP Advantage:</span> Start small, scale fast, never rebuild
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success factors */}
      <div className={`max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-12 transition-all duration-700 delay-1200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="font-bold text-green-900 mb-2">✓ Speed to Value</div>
          <div className="text-sm text-green-700">
            See ROI in weeks with pilot deployments that scale seamlessly
          </div>
        </div>
        <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="font-bold text-blue-900 mb-2">✓ Controlled Growth</div>
          <div className="text-sm text-blue-700">
            MCP architecture ensures governance at every stage of expansion
          </div>
        </div>
        <div className="p-6 rounded-lg bg-gradient-to-br from-purple-50 to-fuchsia-50 border-2 border-purple-200">
          <div className="font-bold text-purple-900 mb-2">✓ Future Proof</div>
          <div className="text-sm text-purple-700">
            Add capabilities without rebuilding your AI foundation
          </div>
        </div>
      </div>
    </div>
  )
}
