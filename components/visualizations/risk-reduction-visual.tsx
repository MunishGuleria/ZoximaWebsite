"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle, CheckCircle2, Eye, Lock, FileCheck } from "lucide-react"

interface RiskItem {
  concern: string
  before: string
  after: string
  icon: React.ReactNode
  color: string
}

const riskItems: RiskItem[] = [
  {
    concern: "Governance & Control",
    before: "AI operates as a black box with no oversight",
    after: "MCP provides centralized control and visibility",
    icon: <Shield className="h-5 w-5" />,
    color: "primary"
  },
  {
    concern: "Data Security",
    before: "Uncontrolled access to sensitive information",
    after: "Role-based permissions and audit trails built-in",
    icon: <Lock className="h-5 w-5" />,
    color: "secondary"
  },
  {
    concern: "Compliance",
    before: "Regulatory requirements manually tracked",
    after: "Automated compliance checks and documentation",
    icon: <FileCheck className="h-5 w-5" />,
    color: "accent"
  },
  {
    concern: "Transparency",
    before: "Unexplainable AI decisions create risk",
    after: "Full traceability with LangSmith observability",
    icon: <Eye className="h-5 w-5" />,
    color: "primary"
  }
]

function RiskComparisonCard({ item, index, isVisible }: { item: RiskItem; index: number; isVisible: boolean }) {
  return (
    <div 
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card className="border-2 hover:shadow-lg transition-shadow">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg bg-${item.color}/10 flex items-center justify-center text-${item.color}`}>
              {item.icon}
            </div>
            <h4 className="font-bold text-lg">{item.concern}</h4>
          </div>

          {/* Before state */}
          <div className="p-4 rounded-lg bg-red-50/50 border-2 border-red-200">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-red-900">Without MCP:</span>
            </div>
            <p className="text-sm text-red-700">{item.before}</p>
          </div>

          {/* After state */}
          <div className="p-4 rounded-lg bg-green-50/50 border-2 border-green-200">
            <div className="flex items-start gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-green-900">With MCP:</span>
            </div>
            <p className="text-sm text-green-700">{item.after}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function RiskReductionVisual() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-12 my-16">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold">From AI Chaos to Controlled Innovation</h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          MCP architecture transforms AI from a potential risk into a governed, transparent, and secure business asset
        </p>
      </div>

      {/* Risk comparison grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {riskItems.map((item, index) => (
          <RiskComparisonCard 
            key={index} 
            item={item} 
            index={index} 
            isVisible={isVisible}
          />
        ))}
      </div>

      {/* Benefits summary */}
      <div className={`max-w-5xl mx-auto mt-16 transition-all duration-700 delay-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <Card className="border-2 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h4 className="text-xl font-bold text-green-900 mb-2">
                The MCP Governance Advantage
              </h4>
              <p className="text-sm text-green-700">
                Enterprise-grade security and control built into every layer
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/60 rounded-lg">
                <div className="text-3xl font-bold text-green-700 mb-2">100%</div>
                <div className="text-sm font-medium text-green-900 mb-1">Audit Trail</div>
                <div className="text-xs text-green-600">Every AI decision logged</div>
              </div>

              <div className="text-center p-4 bg-white/60 rounded-lg">
                <div className="text-3xl font-bold text-green-700 mb-2">Zero</div>
                <div className="text-sm font-medium text-green-900 mb-1">Black Boxes</div>
                <div className="text-xs text-green-600">Full transparency</div>
              </div>

              <div className="text-center p-4 bg-white/60 rounded-lg">
                <div className="text-3xl font-bold text-green-700 mb-2">Real-time</div>
                <div className="text-sm font-medium text-green-900 mb-1">Monitoring</div>
                <div className="text-xs text-green-600">LangSmith observability</div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-green-200 text-center">
              <p className="text-sm font-medium text-green-900">
                <Shield className="inline h-4 w-4 mr-2" />
                Peace of mind for CXOs: Innovation without compromising control
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key differentiators */}
      <div className={`max-w-6xl mx-auto grid md:grid-cols-4 gap-4 transition-all duration-700 delay-900 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {[
          { label: "Centralized Control", desc: "Single pane of glass" },
          { label: "Compliance by Design", desc: "Regulatory requirements built-in" },
          { label: "Cost Optimization", desc: "Usage tracking & model selection" },
          { label: "Scalable Security", desc: "Grow without new risks" }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors">
            <div className="font-bold text-sm mb-1">{item.label}</div>
            <div className="text-xs text-muted-foreground">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
