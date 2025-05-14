"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, SparklesIcon } from "lucide-react"
import Image from "next/image"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import InstagramPost from "@/components/instagram-post"

// Define message types
type MessageRole = "assistant" | "user"

interface Message {
  id: string
  role: MessageRole
  content: string | React.ReactNode
}

// Predefined Q&A pairs
const predefinedResponses: Record<string, React.ReactNode> = {
  "Can you give me a store performance update?": (
    <div>
      <p>Here&apos;s a quick performance update for the past 7 days:</p>
      <p className="mt-2">
        Views: 2,145 (⬆️ up 18%)
        <br />
        Sales: 34 orders (⬇️ down 9%)
        <br />
        Revenue: $1,021.50
        <br />
        Conversion Rate: 1.59% (⬇️ down from 1.87%)
      </p>
      <p className="mt-2">
        Your traffic is growing, which is great! That means your visibility is improving, likely thanks to optimized
        listings and social content. Offer a time-limited promotion (e.g., 10% off for 48 hours) to boost conversions.
      </p>
    </div>
  ),
  "Which of my products are performing best right now?": (
    <div>
      <p>Here are your top 3 performing listings this week:</p>

      <div className="mt-3 p-3 bg-pink-50 rounded-md">
        <p className="font-semibold">1. Rainbow Tourmaline Stacking Ring</p>
        <p>
          • Listing ID: 987654321
          <br />• Views: 512 | Favorites: 38 | Orders: 12
          <br />🔗 <span className="text-pink-500">View on Etsy</span>
        </p>
        <p className="mt-2">
          This one&apos;s really gaining traction. It might be worth highlighting in your next Instagram post or
          featuring in a limited-time offer.
        </p>
      </div>

      <div className="mt-3 p-3 bg-pink-50 rounded-md">
        <p className="font-semibold">2. Minimalist Gold Hoop Earrings – 14K</p>
        <p>
          • Listing ID: 876543210
          <br />• Views: 436 | Favorites: 27 | Orders: 9<br />🔗 <span className="text-pink-500">View on Etsy</span>
        </p>
        <p className="mt-2">
          A consistent favorite! Clean designs like this often do well with updated close-up shots or lifestyle reels.
        </p>
      </div>

      <div className="mt-3 p-3 bg-pink-50 rounded-md">
        <p className="font-semibold">3. Dainty Birthstone Charm Necklace</p>
        <p>
          • Listing ID: 765432109
          <br />• Views: 398 | Favorites: 31 | Orders: 8<br />🔗 <span className="text-pink-500">View on Etsy</span>
        </p>
        <p className="mt-2">
          This one has great gift appeal — a carousel post or customer review might help drive more traffic.
        </p>
      </div>
    </div>
  ),
  "Show me the new product images you made.": (
    <div>
      <p>Here are the new images I&apos;ve created for you:</p>

      <div className="mt-3">
        <p className="font-semibold">Multistone Opal Women&apos;s Watch | Listing ID: 987654321</p>
        <div className="mt-2 relative h-64 w-full">
          <Image
            src="/images/watch.jpeg"
            alt="Multistone Opal Women's Watch"
            fill
            className="object-contain rounded-md"
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold">Silver Garnet Earrings | Listing ID: 876543210</p>
        <div className="mt-2 relative h-64 w-full">
          <Image src="/images/earring.jpeg" alt="Silver Garnet Earrings" fill className="object-contain rounded-md" />
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold">Silver Cuff Bracelet | Listing ID: 765432109</p>
        <div className="mt-2 relative h-64 w-full">
          <Image src="/images/bracelet.jpeg" alt="Silver Cuff Bracelet" fill className="object-contain rounded-md" />
        </div>
      </div>
    </div>
  ),
  "Can I see this week's Instagram posts?": (
    <div className="space-y-6">
      <p>Of course! Here are the Instagram posts we&apos;ve shared for your shop this week:</p>

      <div className="flex gap-4 overflow-x-auto pb-4">
        <div className="w-[280px] flex-shrink-0">
          <InstagramPost
            imageSrc="/images/1.jpeg"
            caption={`Check out this ring from my collection. it's a handcrafted sterling silver ring with a stunning 10mm natural white pearl.

the detailed oxidized finish gives it a rustic, antique charm.

the intricate branch design wrapping around the pearl makes it truly unique.

perfect for adding a touch of elegance to any outfit. 🌿✨

#ring #handmadejewellery #jewelry #finejewelry #jewelrylover`}
          />
        </div>

        <div className="w-[280px] flex-shrink-0">
          <InstagramPost
            imageSrc="/images/2.jpeg"
            caption={`This chain bracelet ring with moonstone and amethyst gemstones is a stunner. it has a heart-shaped ring that's linked to the bracelet, making it whimsical yet elegant.

designed in our eco-friendly workshop, it's a unique handmade piece. 🌿🌸

#chainbracelet #handmadejewellery #jewelrylover`}
          />
        </div>

        <div className="w-[280px] flex-shrink-0">
          <InstagramPost
            imageSrc="/images/3.jpeg"
            caption={`Here's our sterling silver wide cuff bracelet with gemstones.

this beauty shines with its wavy, textured design and vibrant purple gemstones.

handcrafted with care, it's a piece of art that stands out on any wrist.

and there's a matching ring and earrings too 😉

#jewellery #handmadejewellery #jewelrylover`}
          />
        </div>
      </div>
    </div>
  ),
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsThinking(true)
    setShowWelcome(false)

    // Simulate thinking delay
    setTimeout(() => {
      setIsThinking(false)

      // Find matching predefined response by checking if the input contains the key phrases
      // This makes the matching more flexible
      const userInputLower = input.trim().toLowerCase()
      let foundResponse: React.ReactNode | null = null

      // Check for each predefined response key
      if (userInputLower.includes("store performance") || userInputLower.includes("performance update")) {
        foundResponse = predefinedResponses["Can you give me a store performance update?"]
      } else if (userInputLower.includes("products performing") || userInputLower.includes("best right now")) {
        foundResponse = predefinedResponses["Which of my products are performing best right now?"]
      } else if (userInputLower.includes("product images") || userInputLower.includes("new product images")) {
        foundResponse = predefinedResponses["Show me the new product images you made."]
      } else if (userInputLower.includes("instagram") || userInputLower.includes("this week's instagram")) {
        foundResponse = predefinedResponses["Can I see this week's Instagram posts?"]
      }

      if (foundResponse) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: foundResponse,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        // Default response if no predefined answer
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I don't have information about that yet. Is there something else I can help you with?",
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    }, 1500)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen" style={{ background: '#FFB1EE', fontFamily: 'DM Sans, sans-serif' }}>
        {/* Header */}
        {showWelcome ? (
          <div className="bg-[#FFB1EE] p-4 flex items-center justify-center">
            <Image src="/images/logo.svg" alt="Goopss Logo" width={96} height={32} priority />
          </div>
        ) : (
          <div className="p-2 flex items-center bg-[#FFD0F5] rounded-full mx-4 mt-4" >
            <Image src="/images/logo.svg" alt="Goopss Logo" width={80} height={28} priority className="ml-4" />
          </div>
        )}

        {/* Chat container */}
        <div className={`relative flex-1 max-w-4xl mx-auto w-full ${messages.length === 0 ? 'hidden' : ''}`}>
          <div className="absolute inset-0 overflow-y-auto space-y-6 chat-scrollbar pr-0 px-8 py-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <Image src="/images/emma.jpg" alt="Emma" width={40} height={40} className="object-cover" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-[40px] ${
                    message.role === "user"
                      ? "bg-[#F2FFB1] text-black text-left"
                      : "bg-white text-black"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="h-10 w-10 rounded-full overflow-hidden ml-2 flex-shrink-0">
                    <Image src="/images/michelle.jpg" alt="Michelle" width={40} height={40} className="object-cover" />
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <Image src="/images/emma.jpg" alt="Emma" width={40} height={40} className="object-cover" />
                </div>
                <div className="max-w-[80%] rounded-lg p-4 bg-white text-black">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-pink-400 animate-bounce-higher"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-pink-400 animate-bounce-higher"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-pink-400 animate-bounce-higher"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Initial centered input or bottom input based on messages */}
        <div className={`px-8 py-4 ${messages.length === 0 ? 'bg-transparent flex-1 flex flex-col justify-start pt-40' : 'bg-transparent'}`}>
          <div className="max-w-2xl mx-auto w-full">
            {showWelcome ? (
              <>
                <div className="text-center mb-6">
                  <p className="text-2xl">Hi Michelle! I'm Emma, your shop assistant 🤝 How can I help you today?</p>
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-white border-pink-300 focus-visible:ring-pink-500 h-16 rounded-2xl text-lg px-6"
                    disabled={isThinking}
                  />
                  <Button type="submit" disabled={isThinking || !input.trim()} className="bg-pink-500 hover:bg-pink-600 h-16 w-16 rounded-2xl">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {Object.keys(predefinedResponses).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="inline-flex px-3 py-2 rounded-xl bg-white/50 hover:bg-white/80 transition-colors text-gray-700 text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-[#FFD0F5] rounded-2xl shadow-md p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-white border-pink-300 focus-visible:ring-pink-500 h-16 rounded-2xl text-lg px-6"
                    disabled={isThinking}
                  />
                  <Button type="submit" disabled={isThinking || !input.trim()} className="bg-pink-500 hover:bg-pink-600 h-16 w-16 rounded-2xl">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
                <div className="mt-4 flex gap-2 w-full overflow-hidden">
                  {Object.keys(predefinedResponses).slice(1).map((suggestion) => (
                    <Tooltip key={suggestion}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/50 hover:bg-white/80 transition-colors text-gray-700 text-sm overflow-hidden whitespace-nowrap text-ellipsis"
                          title={suggestion}
                        >
                          {suggestion}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="bg-gray-800 text-white">
                        {suggestion}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
