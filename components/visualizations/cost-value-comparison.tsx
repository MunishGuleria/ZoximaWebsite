"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, TrendingDown, TrendingUp, Zap, DollarSign, Clock } from "lucide-react"

export function CostValueComparison() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-8 my-16">
      <div className="text-center space-y-4 mb-12">
        <h3 className="text-3xl font-bold">AI Investment vs Traditional Approach</h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          See how AI-powered implementation delivers superior value at lower cost
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Traditional Approach */}
        <Card 
          className={`border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-orange-50/50 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                <TrendingDown className="h-4 w-4" />
                Traditional Approach
              </div>
              <h4 className="text-2xl font-bold text-red-900">Slow & Expensive</h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                <Clock className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-900 mb-1">6-12 Months</div>
                  <div className="text-sm text-red-700">Time to market</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                <DollarSign className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-900 mb-1">$500K - $2M+</div>
                  <div className="text-sm text-red-700">Implementation cost</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-900 mb-1">Limited Scale</div>
                  <div className="text-sm text-red-700">Pilot remains pilot</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-900 mb-1">High Risk</div>
                  <div className="text-sm text-red-700">No governance framework</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-red-200">
              <div className="text-sm text-red-700 font-medium">
                Result: High cost, slow ROI, limited impact
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI-Powered Approach */}
        <Card 
          className={`border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          } relative overflow-hidden`}
        >
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-bold shadow-lg">
              <Zap className="h-3 w-3" />
              RECOMMENDED
            </span>
          </div>

          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                AI-Powered Approach
              </div>
              <h4 className="text-2xl font-bold text-green-900">Fast & Scalable</h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg border-2 border-green-200">
                <Clock className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-green-900 mb-1">3-8 Weeks</div>
                  <div className="text-sm text-green-700">Rapid deployment</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg border-2 border-green-200">
                <DollarSign className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-green-900 mb-1">30-40% Lower</div>
                  <div className="text-sm text-green-700">Cost reduction</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg border-2 border-green-200">
                <TrendingUp className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-green-900 mb-1">100+ Use Cases</div>
                  <div className="text-sm text-green-700">Scales enterprise-wide</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg border-2 border-green-200">
                <TrendingUp className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-green-900 mb-1">Built-in Governance</div>
                  <div className="text-sm text-green-700">MCP framework ensures control</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-green-200">
              <div className="text-sm text-green-700 font-medium">
                Result: Quick ROI, enterprise scale, controlled growth
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Value Metrics */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className={`grid md:grid-cols-3 gap-6 transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl font-bold text-primary">3-5x</div>
              <div className="text-sm font-bold">Faster Time-to-Value</div>
              <div className="text-xs text-muted-foreground">From pilot to production in weeks, not months</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl font-bold text-secondary">40%</div>
              <div className="text-sm font-bold">Lower Total Cost</div>
              <div className="text-xs text-muted-foreground">Reduced development and maintenance costs</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl font-bold text-accent">100+</div>
              <div className="text-sm font-bold">Scalable Use Cases</div>
              <div className="text-xs text-muted-foreground">Same foundation grows with your needs</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className={`text-center mt-12 transition-all duration-700 delay-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="inline-flex items-center gap-3 px-6 py-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <Zap className="h-6 w-6 text-green-600" />
          <div className="text-left">
            <div className="font-bold text-green-900">Ready to start smart?</div>
            <div className="text-sm text-green-700">Begin with 2-4 high-impact use cases</div>
          </div>
          <ArrowRight className="h-5 w-5 text-green-600" />
        </div>
      </div>
    </div>
  )
}
