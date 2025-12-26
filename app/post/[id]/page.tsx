import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Eye, Send } from "lucide-react"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { revalidatePath } from "next/cache"

async function postComment(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const postId = formData.get("postId") as string
  const content = formData.get("content") as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !content.trim()) {
    return { error: "Unauthorized or empty comment" }
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content: content.trim(),
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/post/${postId}`)
  return { success: true }
}

async function toggleLike(postId: string, isLiked: boolean) {
  "use server"
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  if (isLiked) {
    await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id)
  } else {
    await supabase.from("likes").insert({ post_id: postId, user_id: user.id })
  }

  revalidatePath(`/post/${postId}`)
  return { success: true }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch post with all details
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:author_id (id, display_name, avatar_url),
      colleges:college_id (id, name),
      likes (id, user_id),
      comments (
        id,
        content,
        created_at,
        profiles:author_id (display_name, avatar_url)
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error || !post) {
    notFound()
  }

  // Increment view count
  await supabase.rpc("increment_view_count", { post_id: id }).catch(() => {
    // Fallback if function doesn't exist
    supabase
      .from("posts")
      .update({ view_count: post.view_count + 1 })
      .eq("id", id)
  })

  const isLiked = post.likes?.some((like: any) => like.user_id === user.id)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Post Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.profiles.avatar_url || undefined} />
                <AvatarFallback>{getInitials(post.profiles.display_name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1">
                <p className="font-semibold text-lg">{post.profiles.display_name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link href={`/college/${post.colleges.id}`} className="hover:underline">
                    {post.colleges.name}
                  </Link>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              <Badge variant="secondary">{post.type}</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {post.title && <h1 className="text-3xl font-bold text-balance">{post.title}</h1>}

              {post.type === "photo" && post.media_url && (
                <div className="relative w-full overflow-hidden rounded-lg">
                  <img
                    src={post.media_url || "/placeholder.svg"}
                    alt={post.title || "Post image"}
                    className="w-full h-auto object-contain max-h-[600px]"
                  />
                </div>
              )}

              {post.type === "video" && post.media_url && (
                <div className="relative w-full overflow-hidden rounded-lg">
                  <video src={post.media_url} controls className="w-full h-auto max-h-[600px]">
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {post.content && (
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</div>
              )}

              {/* Engagement */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <form
                  action={async () => {
                    "use server"
                    await toggleLike(post.id, isLiked)
                  }}
                >
                  <Button type="submit" variant="ghost" size="sm" className={`gap-2 ${isLiked ? "text-red-500" : ""}`}>
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    {post.likes?.length || 0}
                  </Button>
                </form>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments?.length || 0}
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                  <Eye className="h-4 w-4" />
                  {post.view_count + 1}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Comments</h2>

            {/* Comment Form */}
            <Card>
              <CardContent className="pt-6">
                <form action={postComment} className="flex gap-4">
                  <input type="hidden" name="postId" value={post.id} />
                  <Textarea placeholder="Write a comment..." name="content" rows={3} className="resize-none" required />
                  <Button type="submit" size="sm" className="gap-2">
                    <Send className="h-4 w-4" />
                    Post
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment: any) => (
                  <Card key={comment.id}>
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                      <Avatar>
                        <AvatarImage src={comment.profiles.avatar_url || undefined} />
                        <AvatarFallback>{getInitials(comment.profiles.display_name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{comment.profiles.display_name}</p>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-2 leading-relaxed">{comment.content}</p>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
