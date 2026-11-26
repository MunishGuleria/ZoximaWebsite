"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, Wrench, DollarSign, UserPlus } from "lucide-react"
import { useState } from "react"

const useCases = [
  {
    category: "Sales & Distribution",
    icon: TrendingUp,
    count: 8,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/50",
    examples: [
      "Field Sales Super App",
      "Van Sales (DSD) App",
      "Sales Assistant AI Bot",
      "Lead & Opportunity Scoring",
      "Cross-Sell/Upsell AI"
    ]
  },
  {
    category: "Customer & Partners",
    icon: Users,
    count: 7,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    hoverBorder: "hover:border-purple-500/50",
    examples: [
      "Customer Commerce Portal",
      "Dealer/Distributor Portal",
      "Vendor Onboarding & KYC",
      "Architect/Influencer App",
      "Customer Self-Service"
    ]
  },
  {
    category: "Service & Operations",
    icon: Wrench,
    count: 6,
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    hoverBorder: "hover:border-orange-500/50",
    examples: [
      "Field Service App",
      "Warranty & Claims",
      "Preventive Maintenance",
      "AI Knowledge Assistant",
      "Complaint Management"
    ]
  },
  {
    category: "Finance & Compliance",
    icon: DollarSign,
    count: 6,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    hoverBorder: "hover:border-green-500/50",
    examples: [
      "Credit Control Workflow",
      "Invoice Processing",
      "Expense & Travel Approvals",
      "Budgeting & Forecasting",
      "Contract Management"
    ]
  },
  {
    category: "Marketing, HR & R&D",
    icon: UserPlus,
    count: 8,
    color: "text-cyan-600",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    hoverBorder: "hover:border-cyan-500/50",
    examples: [
      "Campaign Planning & Execution",
      "Event & BTL Management",
      "Product Launch Workflow",
      "Employee Self-Service App",
      "Strategic Workforce Planning"
    ]
  }
]

function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const [count, setCount] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        const duration = 1500
        const steps = 60
        const increment = value / steps
        let current = 0
        
        setTimeout(() => {
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }, delay)
      }}
      className="text-5xl font-bold"
    >
      {count}+
    </motion.div>
  )
}

export function UseCaseGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const totalCases = useCases.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-4">30+ Use Cases Across All Functions</h3>
          <p className="text-lg text-muted-foreground">AI-powered apps and automations for every business need</p>
        </motion.div>
      </div>

      {/* Total Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 text-center"
      >
        <div className="text-sm text-muted-foreground mb-2">Total Delivered Use Cases</div>
        <AnimatedCounter value={totalCases} />
      </motion.div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase, index) => {
          const Icon = useCase.icon
          const isHovered = hoveredIndex === index

          return (
            <motion.div
              key={useCase.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className={`relative p-6 rounded-xl border-2 ${useCase.bgColor} ${useCase.borderColor} ${useCase.hoverBorder} transition-all duration-300 cursor-pointer group`}
            >
              {/* Icon and Counter */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${useCase.bgColor} border-2 ${useCase.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${useCase.color}`} />
                </div>
                <div className={`text-right ${useCase.color}`}>
                  <AnimatedCounter value={useCase.count} delay={index * 100} />
                  <div className="text-xs text-muted-foreground">use cases</div>
                </div>
              </div>

              {/* Category Name */}
              <h4 className="font-bold text-lg mb-3">{useCase.category}</h4>

              {/* Examples List - Shows on hover */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  height: isHovered ? "auto" : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Examples:</div>
                  {useCase.examples.map((example, i) => (
                    <motion.div
                      key={example}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <span className={`mt-1 w-1.5 h-1.5 rounded-full ${useCase.bgColor} border ${useCase.borderColor}`} />
                      <span className="flex-1">{example}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Hover prompt */}
              {!isHovered && (
                <div className="text-xs text-muted-foreground mt-3 opacity-50 group-hover:opacity-100 transition-opacity">
                  Hover to see examples →
                </div>
              )}

              {/* Glow effect */}
              <div className={`absolute inset-0 ${useCase.bgColor} opacity-0 group-hover:opacity-20 blur-xl rounded-xl transition-opacity -z-10`} />
            </motion.div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-12 p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20 text-center"
      >
        <p className="text-sm font-medium text-muted-foreground">
          Custom use cases delivered in <span className="font-bold text-accent">3-8 weeks</span> with AI-accelerated development
        </p>
      </motion.div>
    </div>
  )
}
