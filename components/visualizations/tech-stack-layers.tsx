"use client"

import { motion } from "framer-motion"
import { Code, Layers, Sparkles } from "lucide-react"

const techStack = {
  lowCode: {
    title: "Low-Code Platforms",
    technologies: ["Salesforce", "Power Platform", "Dynamics 365", "Bubble.io"],
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    glowColor: "shadow-blue-500/20"
  },
  proCode: {
    title: "Pro-Code Development",
    technologies: ["Node.js", "React", "Python", "Flutter"],
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    glowColor: "shadow-purple-500/20"
  },
  aiLayer: {
    title: "AI Enhancement Layer",
    technologies: ["Claude", "GPT-4", "LangSmith", "Vector DBs"],
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    glowColor: "shadow-green-500/20"
  }
}

export function TechStackLayers() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-4">Cross-Platform AI Development</h3>
          <p className="text-lg text-muted-foreground">AI enhances every layer of your technology stack</p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Connection Lines - Desktop */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          {/* Vertical connecting lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Animated connecting lines */}
            <motion.line
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              viewport={{ once: true }}
              x1="25%" y1="75%" x2="50%" y2="25%"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <motion.line
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 0.7 }}
              viewport={{ once: true }}
              x1="75%" y1="75%" x2="50%" y2="25%"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>

        {/* Stack Layers */}
        <div className="relative space-y-8 lg:space-y-0">
          {/* AI Layer - Top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative z-10 lg:mb-12"
          >
            <div className={`max-w-2xl mx-auto p-8 rounded-2xl border-2 ${techStack.aiLayer.borderColor} ${techStack.aiLayer.bgColor} ${techStack.aiLayer.glowColor} shadow-xl`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl ${techStack.aiLayer.bgColor} border-2 ${techStack.aiLayer.borderColor} flex items-center justify-center`}>
                  <Sparkles className={`h-7 w-7 ${techStack.aiLayer.color}`} />
                </div>
                <div>
                  <h4 className="text-xl font-bold">{techStack.aiLayer.title}</h4>
                  <p className="text-sm text-muted-foreground">Powers all development layers</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {techStack.aiLayer.technologies.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className={`px-4 py-2 rounded-lg ${techStack.aiLayer.bgColor} border ${techStack.aiLayer.borderColor} text-sm font-medium ${techStack.aiLayer.color}`}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>

              {/* Pulse effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute inset-0 rounded-2xl ${techStack.aiLayer.bgColor} opacity-20 blur-xl -z-10`}
              />
            </div>
          </motion.div>

          {/* Platform Layers - Bottom */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Low-Code */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className={`p-8 rounded-2xl border-2 ${techStack.lowCode.borderColor} ${techStack.lowCode.bgColor} hover:${techStack.lowCode.glowColor} hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${techStack.lowCode.bgColor} border-2 ${techStack.lowCode.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Layers className={`h-6 w-6 ${techStack.lowCode.color}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{techStack.lowCode.title}</h4>
                    <p className="text-xs text-muted-foreground">Rapid deployment</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {techStack.lowCode.technologies.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                      className={`px-4 py-2 rounded-lg ${techStack.lowCode.bgColor} border ${techStack.lowCode.borderColor} text-sm font-medium ${techStack.lowCode.color}`}
                    >
                      {tech}
                    </motion.div>
                  ))}
                </div>

                {/* Connecting indicator */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 right-1/4 w-6 h-6 rounded-full bg-green-500/20 border-2 border-green-500/40 hidden lg:flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </motion.div>
              </div>
            </motion.div>

            {/* Pro-Code */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className={`p-8 rounded-2xl border-2 ${techStack.proCode.borderColor} ${techStack.proCode.bgColor} hover:${techStack.proCode.glowColor} hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${techStack.proCode.bgColor} border-2 ${techStack.proCode.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Code className={`h-6 w-6 ${techStack.proCode.color}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{techStack.proCode.title}</h4>
                    <p className="text-xs text-muted-foreground">Custom solutions</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {techStack.proCode.technologies.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      viewport={{ once: true }}
                      className={`px-4 py-2 rounded-lg ${techStack.proCode.bgColor} border ${techStack.proCode.borderColor} text-sm font-medium ${techStack.proCode.color}`}
                    >
                      {tech}
                    </motion.div>
                  ))}
                </div>

                {/* Connecting indicator */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-3 left-1/4 w-6 h-6 rounded-full bg-green-500/20 border-2 border-green-500/40 hidden lg:flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Key Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="mt-12 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 text-center"
      >
        <p className="text-sm font-medium">
          <span className="text-primary font-bold">AI accelerates development</span> across all platforms — from rapid low-code deployments to complex custom solutions
        </p>
      </motion.div>
    </div>
  )
}
