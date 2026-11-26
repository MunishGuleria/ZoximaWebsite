"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface AgentNode {
  id: string
  label: string
  x: number
  y: number
  color: string
  icon: string
}

const agents: AgentNode[] = [
  { id: "mcp", label: "MCP Server", x: 50, y: 50, color: "#3b82f6", icon: "⚡" },
  { id: "finance", label: "Finance Agent", x: 20, y: 25, color: "#10b981", icon: "💰" },
  { id: "sales", label: "Sales Agent", x: 80, y: 25, color: "#8b5cf6", icon: "📊" },
  { id: "compliance", label: "Compliance Agent", x: 20, y: 75, color: "#f59e0b", icon: "✓" },
  { id: "service", label: "Service Agent", x: 80, y: 75, color: "#ec4899", icon: "🔧" }
]

interface DataPacket {
  id: number
  from: string
  to: string
  progress: number
}

export function AgentWorkflowAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeConnections, setActiveConnections] = useState<string[]>([])
  const [dataPackets, setDataPackets] = useState<DataPacket[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // Simulate data flow between agents
    const interval = setInterval(() => {
      const connections = [
        "finance-mcp", "sales-mcp", "compliance-mcp", "service-mcp",
        "mcp-finance", "mcp-sales", "mcp-compliance", "mcp-service"
      ]
      
      const randomConnection = connections[Math.floor(Math.random() * connections.length)]
      setActiveConnections(prev => {
        const newActive = [...prev, randomConnection]
        if (newActive.length > 3) newActive.shift()
        return newActive
      })

      // Add data packet
      const [from, to] = randomConnection.split("-")
      setDataPackets(prev => [
        ...prev,
        { id: Date.now(), from, to, progress: 0 }
      ])
    }, 2000)

    // Animate data packets
    const packetInterval = setInterval(() => {
      setDataPackets(prev => 
        prev
          .map(packet => ({ ...packet, progress: packet.progress + 2 }))
          .filter(packet => packet.progress <= 100)
      )
    }, 50)

    return () => {
      clearInterval(interval)
      clearInterval(packetInterval)
    }
  }, [isVisible])

  const getAgentPosition = (id: string) => {
    const agent = agents.find(a => a.id === id)
    return agent ? { x: agent.x, y: agent.y } : { x: 50, y: 50 }
  }

  const calculatePacketPosition = (packet: DataPacket) => {
    const from = getAgentPosition(packet.from)
    const to = getAgentPosition(packet.to)
    const progress = packet.progress / 100
    
    return {
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress
    }
  }

  return (
    <div className="space-y-8 my-16">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold">Multi-Agent Collaboration in Action</h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Watch how specialized AI agents communicate through MCP to solve complex business problems
        </p>
      </div>

      <Card className="border-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <CardContent className="p-8">
          {/* SVG Canvas */}
          <div className="relative w-full" style={{ paddingBottom: "60%" }}>
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
            >
              {/* Connection Lines */}
              {agents.filter(a => a.id !== "mcp").map(agent => {
                const mcp = agents.find(a => a.id === "mcp")!
                const isActive = activeConnections.some(conn => 
                  conn.includes(agent.id) && conn.includes("mcp")
                )
                
                return (
                  <g key={`line-${agent.id}`}>
                    <line
                      x1={mcp.x}
                      y1={mcp.y}
                      x2={agent.x}
                      y2={agent.y}
                      stroke={isActive ? agent.color : "#cbd5e1"}
                      strokeWidth="0.3"
                      strokeDasharray={isActive ? "0" : "1,1"}
                      className="transition-all duration-500"
                      opacity={isActive ? 0.8 : 0.3}
                    />
                    {isActive && (
                      <line
                        x1={mcp.x}
                        y1={mcp.y}
                        x2={agent.x}
                        y2={agent.y}
                        stroke={agent.color}
                        strokeWidth="0.3"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                )
              })}

              {/* Data Packets */}
              {dataPackets.map(packet => {
                const pos = calculatePacketPosition(packet)
                const fromAgent = agents.find(a => a.id === packet.from)
                
                return (
                  <circle
                    key={packet.id}
                    cx={pos.x}
                    cy={pos.y}
                    r="0.8"
                    fill={fromAgent?.color || "#3b82f6"}
                    opacity="0.9"
                  >
                    <animate
                      attributeName="r"
                      values="0.8;1.2;0.8"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )
              })}

              {/* Agent Nodes */}
              {agents.map((agent, index) => {
                const isActive = activeConnections.some(conn => conn.includes(agent.id))
                const delay = index * 150
                
                return (
                  <g
                    key={agent.id}
                    className={`transition-all duration-500 ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: `${delay}ms`,
                      transform: isVisible ? 'scale(1)' : 'scale(0)'
                    }}
                  >
                    {/* Pulse ring for active agents */}
                    {isActive && (
                      <circle
                        cx={agent.x}
                        cy={agent.y}
                        r="6"
                        fill="none"
                        stroke={agent.color}
                        strokeWidth="0.3"
                        opacity="0.4"
                      >
                        <animate
                          attributeName="r"
                          values="6;9;6"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.4;0;0.4"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    
                    {/* Agent circle */}
                    <circle
                      cx={agent.x}
                      cy={agent.y}
                      r={agent.id === "mcp" ? "5" : "4"}
                      fill={agent.color}
                      className="transition-all duration-300"
                      opacity={isActive ? 1 : 0.7}
                    >
                      {isActive && (
                        <animate
                          attributeName="r"
                          values={agent.id === "mcp" ? "5;5.5;5" : "4;4.5;4"}
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>
                    
                    {/* Icon */}
                    <text
                      x={agent.x}
                      y={agent.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={agent.id === "mcp" ? "4" : "3"}
                      className="pointer-events-none"
                    >
                      {agent.icon}
                    </text>
                    
                    {/* Label */}
                    <text
                      x={agent.x}
                      y={agent.y + (agent.id === "mcp" ? -8 : -7)}
                      textAnchor="middle"
                      fontSize="2.5"
                      fill="currentColor"
                      className="font-medium"
                    >
                      {agent.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Central Orchestration</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Financial Processing</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">Sales Intelligence</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Compliance Checks</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <span className="text-muted-foreground">Service Management</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-muted-foreground">Data Flow</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Real-Time Collaboration:</strong> Each agent specializes in a specific domain while the MCP server orchestrates their collaboration. When a customer inquiry arrives, multiple agents work together - Finance checks credit, Sales provides recommendations, Compliance validates regulations, and Service handles implementation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
