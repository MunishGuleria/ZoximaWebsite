"use client"

import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown } from "lucide-react"

const savingsData = [
  {
    phase: "Requirements",
    traditional: 100,
    aiPowered: 65,
    savings: 35
  },
  {
    phase: "Prototyping",
    traditional: 100,
    aiPowered: 60,
    savings: 40
  },
  {
    phase: "Development",
    traditional: 100,
    aiPowered: 70,
    savings: 30
  },
  {
    phase: "Testing",
    traditional: 100,
    aiPowered: 60,
    savings: 40
  },
  {
    phase: "Deployment",
    traditional: 100,
    aiPowered: 75,
    savings: 25
  }
]

export function CostSavingsChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-6xl mx-auto py-12 px-4"
    >
      <div className="mb-8 text-center">
        <h3 className="text-3xl font-bold mb-4">Cost & Effort Breakdown</h3>
        <p className="text-lg text-muted-foreground">See savings across every development phase</p>
      </div>

      <Card className="border-2">
        <CardContent className="p-8">
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={savingsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <defs>
                  <linearGradient id="colorTraditional" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="phase" 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  label={{ value: 'Relative Effort (%)', angle: -90, position: 'insideLeft' }}
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
                  formatter={(value: number) => `${value}%`}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="traditional" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fill="url(#colorTraditional)"
                  name="Traditional Development"
                  animationDuration={1500}
                />
                <Area 
                  type="monotone" 
                  dataKey="aiPowered" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorAI)"
                  name="AI-Powered Development"
                  animationDuration={1500}
                  animationBegin={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Key Savings Metrics */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-4 rounded-lg bg-green-500/10 border-2 border-green-500/20 text-center"
            >
              <div className="text-2xl font-bold text-green-600">30-40%</div>
              <div className="text-xs text-muted-foreground mt-1">Requirements Faster</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-4 rounded-lg bg-blue-500/10 border-2 border-blue-500/20 text-center"
            >
              <div className="text-2xl font-bold text-blue-600">Weeks</div>
              <div className="text-xs text-muted-foreground mt-1">Saved in Prototyping</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-4 rounded-lg bg-purple-500/10 border-2 border-purple-500/20 text-center"
            >
              <div className="text-2xl font-bold text-purple-600">25-35%</div>
              <div className="text-xs text-muted-foreground mt-1">Less Dev Effort</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="p-4 rounded-lg bg-orange-500/10 border-2 border-orange-500/20 text-center"
            >
              <div className="text-2xl font-bold text-orange-600">40%</div>
              <div className="text-xs text-muted-foreground mt-1">Faster QA Cycles</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Savings Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-2 border-green-500/20"
      >
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <TrendingDown className="h-8 w-8 text-green-600" />
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">30-40% Overall Cost Reduction</div>
            <div className="text-sm text-muted-foreground mt-1">Plus 50% faster delivery time</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
