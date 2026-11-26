"use client"

import { motion } from "framer-motion"
import { FileText, Smartphone, Code, CheckCircle, ArrowRight } from "lucide-react"

export function DevelopmentLifecycleFlow() {
  const stages = [
    {
      icon: FileText,
      title: "Requirements",
      description: "AI captures business processes",
      benefit: "30-40% faster",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Smartphone,
      title: "Prototyping",
      description: "AI generates mockups instantly",
      benefit: "Weeks saved",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Code,
      title: "Development",
      description: "AI-assisted coding",
      benefit: "25-35% faster",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: CheckCircle,
      title: "Testing",
      description: "Automated test creation",
      benefit: "40% faster QA",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      {/* Desktop/Tablet View - Horizontal Flow */}
      <div className="hidden md:flex items-center justify-between gap-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon
          return (
            <div key={stage.title} className="flex items-center flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Card */}
                <div className={`p-6 rounded-xl border-2 border-border ${stage.bgColor} hover:border-primary/50 transition-all duration-300 hover:shadow-lg`}>
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`w-16 h-16 rounded-lg ${stage.bgColor} border-2 border-border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-8 w-8 ${stage.color}`} />
                    </div>
                    <h4 className="font-bold text-base">{stage.title}</h4>
                    <p className="text-sm text-muted-foreground leading-snug min-h-[40px]">{stage.description}</p>
                    <div className={`px-3 py-1 rounded-full ${stage.bgColor} border border-border`}>
                      <span className={`text-xs font-bold ${stage.color}`}>{stage.benefit}</span>
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <div className={`absolute inset-0 ${stage.bgColor} opacity-0 group-hover:opacity-20 blur-xl rounded-xl transition-opacity -z-10`} />
              </motion.div>

              {/* Arrow */}
              {index < stages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center px-4"
                >
                  <ArrowRight className="h-6 w-6 text-primary" />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile View - Vertical Flow */}
      <div className="md:hidden space-y-6">
        {stages.map((stage, index) => {
          const Icon = stage.icon
          return (
            <div key={stage.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`p-6 rounded-xl border-2 border-border ${stage.bgColor}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-lg ${stage.bgColor} border-2 border-border flex items-center justify-center shrink-0`}>
                      <Icon className={`h-7 w-7 ${stage.color}`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-bold text-base">{stage.title}</h4>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                      <div className={`inline-block px-3 py-1 rounded-full ${stage.bgColor} border border-border`}>
                        <span className={`text-xs font-bold ${stage.color}`}>{stage.benefit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Vertical Arrow */}
              {index < stages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  whileInView={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                  className="flex justify-center py-2"
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-6 w-6 text-primary rotate-90" />
                  </motion.div>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {/* Result Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20"
      >
        <div className="text-center space-y-4">
          <h4 className="text-2xl font-bold">Result: Enterprise-Ready Solutions</h4>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-semibold">50% Faster Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-semibold">30-40% Lower Cost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-semibold">3-8 Week Turnaround</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
