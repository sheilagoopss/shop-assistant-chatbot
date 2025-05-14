import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react"

export default function InstagramPost({
  imageSrc,
  caption,
  username = "lumiere.jewels",
  location = "",
}: {
  imageSrc: string
  caption: string
  username?: string
  location?: string
}) {
  return (
    <div className="bg-white border rounded-sm">
      {/* Post header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-pink-500">
            <Image 
              src="/images/michelle.jpg" 
              alt={username} 
              width={32} 
              height={32} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{username}</span>
            {location && <span className="text-xs">{location}</span>}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Post image */}
      <div className="relative aspect-square w-full">
        <Image src={imageSrc || "/images/placeholder.jpg"} alt="Post image" fill className="object-cover" />
      </div>

      {/* Action buttons */}
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>

        {/* Caption */}
        <div className="text-sm mb-1 whitespace-pre-line">
          <span className="font-semibold">{username}</span> {caption}
        </div>
      </div>
    </div>
  )
} 