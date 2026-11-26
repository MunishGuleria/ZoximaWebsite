"use client"

import { motion } from "framer-motion"
import { Network, Code, MessageSquare, Shield, Zap, Sparkles } from "lucide-react"

export function MCPArchitectureTree() {
  const agents = [
    { name: "Finance Agent", icon: Code, color: "text-blue-500", bgGradient: "from-blue-500/20 via-blue-500/10 to-transparent", borderColor: "border-blue-500/30", shadowColor: "shadow-blue-500/20", description: "Credit risk & collections" },
    { name: "Sales Agent", icon: Zap, color: "text-emerald-500", bgGradient: "from-emerald-500/20 via-emerald-500/10 to-transparent", borderColor: "border-emerald-500/30", shadowColor: "shadow-emerald-500/20", description: "Lead scoring & recommendations" },
    { name: "Compliance Agent", icon: Shield, color: "text-purple-500", bgGradient: "from-purple-500/20 via-purple-500/10 to-transparent", borderColor: "border-purple-500/30", shadowColor: "shadow-purple-500/20", description: "Document scanning & alerts" },
    { name: "Marketing Agent", icon: MessageSquare, color: "text-orange-500", bgGradient: "from-orange-500/20 via-orange-500/10 to-transparent", borderColor: "border-orange-500/30", shadowColor: "shadow-orange-500/20", description: "Personalization & campaigns" },
  ]

  const llms = [
    { name: "OpenAI", gradient: "from-emerald-400 to-emerald-600", shadowColor: "shadow-emerald-500/50" },
    { name: "Azure AI", gradient: "from-blue-400 to-blue-600", shadowColor: "shadow-blue-500/50" },
    { name: "Anthropic", gradient: "from-purple-400 to-purple-600", shadowColor: "shadow-purple-500/50" },
  ]

  return (
    <div className="relative w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none rounded-3xl" />
      
      {/* MCP Server - Root */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-16 sm:mb-20 relative z-10"
      >
        <div className="relative group">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-blue-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
          
          {/* Main circle with enhanced styling */}
          <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary via-purple-500 to-blue-500 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-background to-background/95 flex items-center justify-center backdrop-blur-sm">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Network className="h-10 w-10 sm:h-14 sm:w-14 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          
          {/* Sparkle effects */}
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-pulse" />
          <Sparkles className="absolute -bottom-2 -left-2 h-5 w-5 text-blue-500 animate-pulse delay-75" />
        </div>
        
        <h3 className="mt-6 sm:mt-8 text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
          MCP Server
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md mt-2 font-medium">
          Central orchestration layer
        </p>
      </motion.div>

      {/* Enhanced Connection Line with Glow */}
      <div className="flex justify-center mb-10 sm:mb-14 relative">
        <div className="relative">
          <div className="absolute inset-0 w-0.5 h-12 sm:h-16 bg-primary/30 blur-sm left-1/2 -translate-x-1/2" />
          <div className="w-0.5 h-12 sm:h-16 bg-gradient-to-b from-primary via-primary/60 to-primary/20 rounded-full" />
        </div>
      </div>

      {/* Specialized Agents Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/20">
          <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Specialized AI Agents
          </p>
        </div>
      </motion.div>

      {/* Specialized Agents Grid with Enhanced Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16 sm:mb-20"
      >
        {agents.map((agent, index) => {
          const Icon = agent.icon
          return (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className={`group relative p-6 rounded-2xl border-2 ${agent.borderColor} bg-gradient-to-br ${agent.bgGradient} backdrop-blur-sm hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl h-full overflow-hidden`}>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${agent.bgGradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${agent.shadowColor}`}>
                    <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${agent.color} drop-shadow-sm`} />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-foreground">{agent.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{agent.description}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Enhanced Connection Line to LLMs */}
      <div className="flex justify-center mb-8 sm:mb-12 relative">
        <div className="relative">
          <div className="absolute inset-0 w-0.5 h-10 sm:h-14 bg-primary/20 blur-sm left-1/2 -translate-x-1/2" />
          <div className="w-0.5 h-10 sm:h-14 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent rounded-full" />
        </div>
      </div>

      {/* LLM Layer with Enhanced Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col items-center">
          <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50 mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm font-semibold text-foreground/80">Powered by Multiple LLMs</p>
          </div>
          
          <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap">
            {llms.map((llm, index) => (
              <motion.div
                key={llm.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="group cursor-pointer"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${llm.gradient} opacity-30 rounded-xl blur-lg group-hover:opacity-50 transition-opacity duration-300`} />
                  
                  {/* Badge */}
                  <div className={`relative px-5 sm:px-7 py-3 sm:py-4 rounded-xl bg-gradient-to-r ${llm.gradient} shadow-lg ${llm.shadowColor} group-hover:shadow-2xl transition-all duration-300`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white shadow-sm animate-pulse" />
                      <span className="font-bold text-sm sm:text-base text-white whitespace-nowrap drop-shadow-sm">
                        {llm.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Data flow animation with multiple particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, 100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: i * 1.3,
          }}
          className="absolute left-1/2 top-1/4 -translate-x-1/2 w-2 h-2 bg-primary rounded-full pointer-events-none blur-[0.5px]"
          style={{ 
            boxShadow: "0 0 10px 2px rgba(var(--primary), 0.5)" 
          }}
        />
      ))}
    </div>
  )
}
