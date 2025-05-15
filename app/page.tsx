"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, SparklesIcon } from "lucide-react"
import Image from "next/image"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import InstagramPost from "@/components/instagram-post"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Define message types
type MessageRole = "assistant" | "user"

interface Message {
  id: string
  role: MessageRole
  content: string | React.ReactNode
}

// Product data for dropdown
const products = [
  {
    id: "987654321",
    title: "Multistone Opal Women's Watch",
    image: "/images/watch.jpeg",
  },
  {
    id: "876543210",
    title: "Silver Garnet Earrings",
    image: "/images/earring.jpeg",
  },
  {
    id: "765432109",
    title: "Silver Cuff Bracelet",
    image: "/images/bracelet.jpeg",
  },
]

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
  "Can you help me schedule an Instagram post for one of my products?": (
    <ScheduleInstagramPost />
  ),
}

// Add the new question to the quick suggestion buttons (both initial and ongoing chat)
const quickSuggestions = [
  "Can you give me a store performance update?",
  "Which of my products are performing best right now?",
  "Show me the new product images you made.",
  "Can I see this week's Instagram posts?",
  "Can you help me schedule an Instagram post for one of my products?",
]

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
      } else if (userInputLower.includes("instagram") && userInputLower.includes("schedule")) {
        foundResponse = predefinedResponses["Can you help me schedule an Instagram post for one of my products?"]
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
                  {quickSuggestions.map((suggestion) => (
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
                  {quickSuggestions.slice(1).map((suggestion) => (
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

// Add the ScheduleInstagramPost component
function ScheduleInstagramPost() {
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("12:00")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const timeOptions = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ]

  const handleSubmit = () => {
    if (!selectedProduct || !date) return
    setIsSubmitted(true)
  }

  const productCaptions = {
    "987654321": `Check out this unique sterling silver cuff watch with inlaid garnets, opal gemstones.

perfect for adding a touch of elegance to any outfit.

tick-tock, it's time to shine ⌚✨

#jewellery #handmadejewellery #finejewelry`,
    "876543210": `These unique silver teardrop earrings with garnet stones are a true piece of autumn. 

the elegant design and the deep red garnet make them stand out. and embody tranquility and natural beauty 🌿.

#earrings #handmadejewellery #jewellerylover`,
    "765432109": `Well, here's a sterling silver cuff bracelet that doesn't scream "i'm trying too hard."

crafted with intricate engravings, it's got circles and lines dancing around like they've got somewhere better to be.

this piece is unisex, because who needs labels anyway? 😏✨

#jewelry #finejewelry #handmadejewellery`
  }

  if (isSubmitted) {
    const selectedProductData = products.find(p => p.id === selectedProduct)
    return (
      <div className="flex justify-start">
        <div className="h-10 w-10 rounded-full overflow-hidden mr-2 flex-shrink-0">
          <Image src="/images/emma.jpg" alt="Emma" width={40} height={40} className="object-cover" />
        </div>
        <div className="max-w-[80%] p-4 rounded-[40px] bg-white text-black">
          <p className="mb-4">Great! I've scheduled your Instagram post for {format(date!, "MMMM d, yyyy")} at {selectedTime}. Here's what will be posted:</p>
          
          <div className="w-[280px]">
            <InstagramPost
              imageSrc={selectedProductData?.image || ""}
              caption={productCaptions[selectedProduct as keyof typeof productCaptions]}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p>Absolutely! Just select the product you'd like to feature and choose the date you'd like it to go live.<br />👇</p>
      <div className="mt-6 flex flex-col gap-4 max-w-md">
        <div>
          <label className="block mb-2 text-base font-medium text-pink-700">Product</label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="bg-white border-pink-300 focus:ring-pink-500 h-14 rounded-2xl text-base px-4">
              <SelectValue placeholder="Choose a product">
                {selectedProduct ? products.find((p) => p.id === selectedProduct)?.title : "Choose a product"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="z-50">
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id} className="flex items-center gap-3 py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={product.image} alt={product.title} width={40} height={40} className="object-cover w-10 h-10" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-base">{product.title}</span>
                      <span className="text-xs text-gray-500">ID: {product.id}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-base font-medium text-pink-700">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-pink-300 focus:ring-pink-500 h-14 rounded-2xl text-base px-4",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-2xl"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center text-lg font-medium",
                    caption_label: "text-pink-700",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 text-pink-500 hover:bg-pink-100 rounded-full",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-pink-700 rounded-md w-12 font-medium text-base",
                    row: "flex w-full mt-2",
                    cell: "h-12 w-12 text-center text-base p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-pink-100 rounded-full",
                    day_selected: "bg-pink-300 text-white hover:bg-pink-400 hover:text-white focus:bg-pink-400 focus:text-white rounded-full",
                    day_today: "bg-pink-100 text-pink-700 rounded-full",
                    day_outside: "text-gray-400 opacity-50",
                    day_disabled: "text-gray-400 opacity-50",
                    day_range_middle: "aria-selected:bg-pink-50 aria-selected:text-pink-700",
                    day_hidden: "invisible",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block mb-2 text-base font-medium text-pink-700">Time</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="bg-white border-pink-300 focus:ring-pink-500 h-14 rounded-2xl text-base px-4">
                <SelectValue>{selectedTime}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!selectedProduct || !date}
          className="mt-2 bg-pink-500 hover:bg-pink-600 h-14 rounded-2xl text-base"
        >
          Schedule Post
        </Button>
      </div>
    </div>
  )
}
