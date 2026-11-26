"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Message {
  text: string
  sender: "customer" | "ai"
  delay: number
}

const conversations: Message[] = [
  { text: "Hi! Are you open today?", sender: "customer", delay: 0 },
  { text: "Yes! We're open 9am-6pm. How can I help you?", sender: "ai", delay: 1500 },
  { text: "Do you have iPhone 15 in stock?", sender: "customer", delay: 3500 },
  { text: "Yes! We have all colors available. Would you like to schedule a visit?", sender: "ai", delay: 5000 },
  { text: "Yes please! Tomorrow at 2pm?", sender: "customer", delay: 7500 },
  { text: "Perfect! I've booked you for tomorrow at 2pm. See you then!", sender: "ai", delay: 9000 },
]

export function PhoneMockup() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex >= conversations.length) {
      const resetTimer = setTimeout(() => {
        setMessages([])
        setCurrentIndex(0)
      }, 3000)
      return () => clearTimeout(resetTimer)
    }

    const timer = setTimeout(
      () => {
        setMessages((prev) => [...prev, conversations[currentIndex]])
        setCurrentIndex((prev) => prev + 1)
      },
      currentIndex === 0 ? 500 : conversations[currentIndex].delay - conversations[currentIndex - 1].delay,
    )

    return () => clearTimeout(timer)
  }, [currentIndex])

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      {/* Phone Frame */}
      <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />

        {/* Screen */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden h-[600px] flex flex-col">
          {/* Status Bar */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between text-xs text-gray-900">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 border border-gray-900 rounded-sm relative">
                <div className="absolute inset-0.5 bg-gray-900 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Chat Header */}
          <div className="bg-primary px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                AI
              </div>
              <div>
                <div className="font-semibold">Business Assistant</div>
                <div className="text-xs text-white/80">Online</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 bg-gray-50 p-4 space-y-3 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn("flex animate-in fade-in slide-in-from-bottom-2 duration-300", {
                  "justify-end": message.sender === "customer",
                  "justify-start": message.sender === "ai",
                })}
              >
                <div
                  className={cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", {
                    "bg-primary text-white rounded-br-sm": message.sender === "customer",
                    "bg-white text-gray-900 rounded-bl-sm shadow-sm": message.sender === "ai",
                  })}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500">Type a message...</div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full" />
    </div>
  )
}
