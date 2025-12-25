import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function FeedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch posts with author and college info
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:author_id (display_name, avatar_url),
      colleges:college_id (name),
      likes (id),
      comments (id)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("[v0] Error fetching posts:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Campus Feed</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Discover content from verified students across colleges
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-9 sm:h-10">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                All Posts
              </TabsTrigger>
              <TabsTrigger value="article" className="text-xs sm:text-sm">
                Articles
              </TabsTrigger>
              <TabsTrigger value="photo" className="text-xs sm:text-sm">
                Photos
              </TabsTrigger>
              <TabsTrigger value="video" className="text-xs sm:text-sm">
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              {posts && posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post as any} currentUserId={user.id} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No posts yet. Be the first to share something!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="article" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              {posts && posts.filter((p) => p.type === "article").length > 0 ? (
                posts
                  .filter((p) => p.type === "article")
                  .map((post) => <PostCard key={post.id} post={post as any} currentUserId={user.id} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No articles yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="photo" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              {posts && posts.filter((p) => p.type === "photo").length > 0 ? (
                posts
                  .filter((p) => p.type === "photo")
                  .map((post) => <PostCard key={post.id} post={post as any} currentUserId={user.id} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No photos yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="video" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              {posts && posts.filter((p) => p.type === "video").length > 0 ? (
                posts
                  .filter((p) => p.type === "video")
                  .map((post) => <PostCard key={post.id} post={post as any} currentUserId={user.id} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No videos yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
