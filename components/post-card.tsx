"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Eye } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

interface Post {
  id: string
  type: "article" | "photo" | "video"
  title: string | null
  content: string | null
  media_url: string | null
  media_type: string | null
  view_count: number
  created_at: string
  profiles: {
    display_name: string
    avatar_url: string | null
  }
  colleges: {
    name: string
  }
  likes: { id: string }[]
  comments: { id: string }[]
}

interface PostCardProps {
  post: Post
  currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
  const supabase = createClient()

  useEffect(() => {
    const checkLike = async () => {
      if (!currentUserId) return
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", currentUserId)
        .single()
      setIsLiked(!!data)
    }
    checkLike()
  }, [currentUserId, post.id, supabase])

  const handleLike = async () => {
    if (!currentUserId) return

    const previousLiked = isLiked
    const previousCount = likeCount

    if (isLiked) {
      // Unlike
      setIsLiked(false)
      setLikeCount((prev) => prev - 1)
      const { error } = await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", currentUserId)
      if (error) {
        // Revert on error
        setIsLiked(previousLiked)
        setLikeCount(previousCount)
      }
    } else {
      // Like
      setIsLiked(true)
      setLikeCount((prev) => prev + 1)
      const { error } = await supabase.from("likes").insert({ post_id: post.id, user_id: currentUserId })
      if (error) {
        // Revert on error
        setIsLiked(previousLiked)
        setLikeCount(previousCount)
      }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar>
          <AvatarImage src={post.profiles.avatar_url || undefined} />
          <AvatarFallback>{getInitials(post.profiles.display_name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <p className="font-semibold">{post.profiles.display_name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{post.colleges.name}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          </div>
        </div>
        <Badge variant="secondary">{post.type}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {post.title && <h3 className="text-xl font-semibold text-balance">{post.title}</h3>}

        {post.type === "photo" && post.media_url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={post.media_url || "/placeholder.svg"}
              alt={post.title || "Post image"}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {post.type === "video" && post.media_url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <video src={post.media_url} controls className="h-full w-full">
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {post.content && <p className="text-muted-foreground leading-relaxed line-clamp-4">{post.content}</p>}

        <Link href={`/post/${post.id}`} className="text-sm text-primary hover:underline">
          Read more →
        </Link>
      </CardContent>
      <CardFooter className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleLike} className={`gap-2 ${isLiked ? "text-red-500" : ""}`}>
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          {likeCount}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href={`/post/${post.id}`}>
            <MessageCircle className="h-4 w-4" />
            {post.comments?.length || 0}
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
          <Eye className="h-4 w-4" />
          {post.view_count}
        </div>
      </CardFooter>
    </Card>
  )
}
