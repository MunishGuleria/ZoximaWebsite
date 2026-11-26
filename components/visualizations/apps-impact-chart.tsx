"use client"

import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const customerData = [
  {
    customer: "Building Materials",
    collections: 25,
    crossSell: 15,
    fill: "#3b82f6"
  },
  {
    customer: "Consumer Brand",
    campaignSpeed: 60,
    savings: 35,
    fill: "#8b5cf6"
  },
  {
    customer: "Medical Devices",
    turnaround: 40,
    compliance: 30,
    fill: "#10b981"
  },
  {
    customer: "Digital Platform",
    billingSpeed: 50,
    engagement: 35,
    fill: "#f59e0b"
  }
]

export function AppsImpactChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-6xl mx-auto py-12 px-4"
    >
      <div className="mb-8 text-center">
        <h3 className="text-3xl font-bold mb-4">Real Customer Impact</h3>
        <p className="text-lg text-muted-foreground">Measurable improvements delivered across enterprise customers</p>
      </div>

      <Card className="border-2">
        <CardContent className="p-8">
          <div className="w-full h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 80,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="customer" 
                  angle={-15}
                  textAnchor="end"
                  height={100}
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'Improvement (%)', angle: -90, position: 'insideLeft' }}
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
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      collections: 'Faster Collections',
                      crossSell: 'Cross-Sell Revenue',
                      campaignSpeed: 'Campaign Speed',
                      savings: 'Cost Savings',
                      turnaround: 'Lower Turnaround',
                      compliance: 'Better Compliance',
                      billingSpeed: 'Faster Billing',
                      engagement: 'Employee Engagement'
                    }
                    return [`${value}%`, labels[name] || name]
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '30px'
                  }}
                  formatter={(value: string) => {
                    const labels: Record<string, string> = {
                      collections: 'Faster Collections',
                      crossSell: 'Cross-Sell Revenue',
                      campaignSpeed: 'Campaign Speed',
                      savings: 'Cost Savings',
                      turnaround: 'Lower Turnaround',
                      compliance: 'Better Compliance',
                      billingSpeed: 'Faster Billing',
                      engagement: 'Employee Engagement'
                    }
                    return labels[value] || value
                  }}
                />
                <Bar 
                  dataKey="collections" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
                <Bar 
                  dataKey="crossSell" 
                  fill="#06b6d4" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationBegin={200}
                />
                <Bar 
                  dataKey="campaignSpeed" 
                  fill="#8b5cf6" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationBegin={400}
                />
                <Bar 
                  dataKey="savings" 
                  fill="#a855f7" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationBegin={600}
                />
                <Bar 
                  dataKey="turnaround" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationBegin={800}
                />
                <Bar 
                  dataKey="compliance" 
                  fill="#14b8a6" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationBegin={1000}
                />
                <Bar 
                  dataKey="billingSpeed" 
                  fill="#f59e0b" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationBegin={1200}
                />
                <Bar 
                  dataKey="engagement" 
                  fill="#fb923c" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationBegin={1400}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Key Highlights Grid */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-4 rounded-lg bg-blue-500/10 border-2 border-blue-500/20 text-center"
            >
              <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">25-60%</div>
              <div className="text-xs text-muted-foreground mt-1">Speed Improvements</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-4 rounded-lg bg-purple-500/10 border-2 border-purple-500/20 text-center"
            >
              <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">$M</div>
              <div className="text-xs text-muted-foreground mt-1">Cost Savings</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-4 rounded-lg bg-green-500/10 border-2 border-green-500/20 text-center"
            >
              <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">40%</div>
              <div className="text-xs text-muted-foreground mt-1">Lower Turnaround</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="p-4 rounded-lg bg-orange-500/10 border-2 border-orange-500/20 text-center"
            >
              <TrendingUp className="h-5 w-5 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">Higher</div>
              <div className="text-xs text-muted-foreground mt-1">Engagement</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/20 text-center"
      >
        <p className="text-sm font-medium">
          <span className="text-primary font-bold">Real results</span> from 30+ use cases across Sales, Service, Finance, Marketing, and HR
        </p>
      </motion.div>
    </motion.div>
  )
}
