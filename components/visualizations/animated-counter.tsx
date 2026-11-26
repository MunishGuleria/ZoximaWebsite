"use client"

import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ 
  value, 
  suffix = "", 
  prefix = "",
  duration = 2,
  className = ""
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.floor(latest)}${suffix}`
      }
    })
  }, [springValue, prefix, suffix])

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>
}

interface StatCardProps {
  value: number | string
  label: string
  description?: string
  suffix?: string
  prefix?: string
  color?: "primary" | "secondary" | "accent"
}

export function StatCard({ 
  value, 
  label, 
  description, 
  suffix = "",
  prefix = "",
  color = "primary"
}: StatCardProps) {
  const colorClasses = {
    primary: "from-primary/10 to-primary/5 border-primary/20 text-primary",
    secondary: "from-secondary/10 to-secondary/5 border-secondary/20 text-secondary",
    accent: "from-accent/10 to-accent/5 border-accent/20 text-accent"
  }

  const isNumeric = typeof value === "number"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative group p-8 rounded-2xl border-2 bg-gradient-to-br ${colorClasses[color]} hover:shadow-xl transition-all duration-300`}
    >
      <div className="text-center space-y-3">
        <div className={`text-4xl lg:text-5xl font-bold ${colorClasses[color].split(" ").pop()}`}>
          {isNumeric ? (
            <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
          ) : (
            <span>{prefix}{value}{suffix}</span>
          )}
        </div>
        <div className="text-base font-semibold text-foreground">{label}</div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {/* Animated ring */}
      <motion.div
        className={`absolute inset-0 rounded-2xl border-2 ${colorClasses[color].split(" ")[2]} opacity-0 group-hover:opacity-100 transition-opacity`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}
