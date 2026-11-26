"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"

const impactData = [
  {
    name: "Compliance Checks",
    improvement: 40,
    description: "Faster regulatory processing",
    color: "#10b981"
  },
  {
    name: "Service Delays",
    improvement: 30,
    description: "Reduction in delays",
    color: "#3b82f6"
  },
  {
    name: "Collections Speed",
    improvement: 50,
    description: "Accelerated cash flow",
    color: "#8b5cf6"
  },
  {
    name: "Call Center Load",
    improvement: 50,
    description: "Reduced workload",
    color: "#f59e0b"
  },
  {
    name: "Campaign Launches",
    improvement: 60,
    description: "Faster time-to-market",
    color: "#ec4899"
  },
  {
    name: "Upsell Conversion",
    improvement: 20,
    description: "Higher revenue per customer",
    color: "#06b6d4"
  }
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border-2 border-primary">
        <p className="font-bold text-lg mb-1">{payload[0].payload.name}</p>
        <p className="text-2xl font-bold mb-2" style={{ color: payload[0].payload.color }}>
          {payload[0].value}% Improvement
        </p>
        <p className="text-sm text-muted-foreground">
          {payload[0].payload.description}
        </p>
      </div>
    )
  }
  return null
}

export function ImpactMetricsChart() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedData, setAnimatedData] = useState(impactData.map(d => ({ ...d, improvement: 0 })))

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedData(impactData.map(item => ({
        ...item,
        improvement: Math.floor(item.improvement * progress)
      })))

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedData(impactData)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <div className="space-y-8 my-16">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold">Measurable Business Impact</h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Real results from enterprise AI implementations across industries
        </p>
      </div>

      <Card className="border-2">
        <CardContent className="p-8">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={animatedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'Improvement (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar 
                  dataKey="improvement" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={2000}
                >
                  {animatedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">40-60%</div>
              <div className="text-sm text-muted-foreground mt-1">Average Improvement</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">3-8</div>
              <div className="text-sm text-muted-foreground mt-1">Weeks to Deploy</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">$5M+</div>
              <div className="text-sm text-muted-foreground mt-1">Average Savings</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">100+</div>
              <div className="text-sm text-muted-foreground mt-1">Scalable Use Cases</div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Key Insights from Real Implementations
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span><strong>Healthcare Provider ($2B):</strong> 40% faster compliance with multi-agent MCP system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span><strong>Visa Processing Giant:</strong> 50% call-center reduction using Voice AI + MCP workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span><strong>Industrial Leader ($9B):</strong> 50% faster collections with AI Sales Assistant</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                <span><strong>Consumer Brand ($5B):</strong> 60% faster campaign launches with LangGraph automation</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
