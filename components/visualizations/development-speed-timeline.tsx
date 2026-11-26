"use client"

import { motion } from "framer-motion"
import { Clock, Zap } from "lucide-react"

export function DevelopmentSpeedTimeline() {
  const traditionalPhases = [
    { name: "Requirements", duration: 2, color: "bg-red-500" },
    { name: "Design", duration: 2, color: "bg-orange-500" },
    { name: "Development", duration: 4, color: "bg-yellow-500" },
    { name: "Testing", duration: 2, color: "bg-amber-500" },
    { name: "Deployment", duration: 2, color: "bg-red-600" },
  ]

  const aiPhases = [
    { name: "Requirements", duration: 0.5, color: "bg-blue-500" },
    { name: "Design", duration: 0.5, color: "bg-cyan-500" },
    { name: "Development", duration: 2, color: "bg-green-500" },
    { name: "Testing", duration: 0.5, color: "bg-emerald-500" },
    { name: "Deployment", duration: 0.5, color: "bg-teal-500" },
  ]

  const traditionalTotal = traditionalPhases.reduce((sum, phase) => sum + phase.duration, 0)
  const aiTotal = aiPhases.reduce((sum, phase) => sum + phase.duration, 0)

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h3 className="text-3xl font-bold mb-4">Development Speed Comparison</h3>
        <p className="text-lg text-muted-foreground">See how AI accelerates every phase of development</p>
      </div>

      <div className="space-y-12">
        {/* Traditional Development */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border-2 border-red-500/20">
              <Clock className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Traditional Development</h4>
              <p className="text-sm text-muted-foreground">6-12 months timeline</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-3xl font-bold text-red-500">{traditionalTotal}</div>
              <div className="text-sm text-muted-foreground">months avg</div>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="relative h-20 bg-muted/30 rounded-xl border-2 border-border overflow-hidden">
            <div className="absolute inset-0 flex">
              {traditionalPhases.map((phase, index) => {
                const percentage = (phase.duration / traditionalTotal) * 100
                const delay = traditionalPhases.slice(0, index).reduce((sum, p) => sum + p.duration, 0) * 0.2
                
                return (
                  <motion.div
                    key={phase.name}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className={`${phase.color} relative border-r border-white/20 flex items-center justify-center`}
                  >
                    <div className="text-center px-2">
                      <div className="text-xs font-bold text-white drop-shadow-lg">{phase.name}</div>
                      <div className="text-xs text-white/90 drop-shadow-lg">{phase.duration}m</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* AI-Powered Development */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-bold">AI-Powered Development</h4>
              <p className="text-sm text-muted-foreground">3-8 weeks timeline</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-3xl font-bold text-primary">{aiTotal}</div>
              <div className="text-sm text-muted-foreground">months avg</div>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="relative h-20 bg-muted/30 rounded-xl border-2 border-primary/20 overflow-hidden">
            <div className="absolute inset-0 flex">
              {aiPhases.map((phase, index) => {
                const percentage = (phase.duration / traditionalTotal) * 100 // Compare against traditional total
                const delay = aiPhases.slice(0, index).reduce((sum, p) => sum + p.duration, 0) * 0.3
                
                return (
                  <motion.div
                    key={phase.name}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, delay: delay + 0.3, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className={`${phase.color} relative border-r border-white/20 flex items-center justify-center group`}
                  >
                    <div className="text-center px-2">
                      <div className="text-xs font-bold text-white drop-shadow-lg">{phase.name}</div>
                      <div className="text-xs text-white/90 drop-shadow-lg">{phase.duration}m</div>
                    </div>
                    
                    {/* Animated pulse effect */}
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white/10"
                    />
                  </motion.div>
                )
              })}
              
              {/* Show saved time as empty space with animation */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${((traditionalTotal - aiTotal) / traditionalTotal) * 100}%` }}
                transition={{ duration: 0.6, delay: 2 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.5 }}
                    viewport={{ once: true }}
                    className="text-sm font-bold text-primary"
                  >
                    Time Saved!
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Efficiency Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.8 }}
            viewport={{ once: true }}
            className="flex items-center justify-end gap-2 text-sm"
          >
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-primary">
              {Math.round(((traditionalTotal - aiTotal) / traditionalTotal) * 100)}% faster delivery
            </span>
          </motion.div>
        </div>
      </div>

      {/* Key Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 3 }}
        viewport={{ once: true }}
        className="mt-12 grid md:grid-cols-3 gap-6"
      >
        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
          <div className="text-3xl font-bold text-primary mb-2">50%</div>
          <div className="text-sm font-medium">Faster Time to Market</div>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20">
          <div className="text-3xl font-bold text-secondary mb-2">30-40%</div>
          <div className="text-sm font-medium">Lower Development Cost</div>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20">
          <div className="text-3xl font-bold text-accent mb-2">3-8</div>
          <div className="text-sm font-medium">Weeks Deployment Time</div>
        </div>
      </motion.div>
    </div>
  )
}
