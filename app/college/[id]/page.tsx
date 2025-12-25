import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, FileText } from "lucide-react"
import { redirect, notFound } from "next/navigation"

export default async function CollegePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch college info
  const { data: college, error: collegeError } = await supabase.from("colleges").select("*").eq("id", id).single()

  if (collegeError || !college) {
    notFound()
  }

  // Fetch posts from this college
  const { data: posts, error: postsError } = await supabase
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
    .eq("college_id", id)
    .order("created_at", { ascending: false })
    .limit(50)

  // Get college stats
  const { count: postCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("college_id", id)

  const { count: studentCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("college_id", id)

  if (postsError) {
    console.error("[v0] Error fetching posts:", postsError)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* College Header */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{college.name}</h1>
                <p className="text-muted-foreground">{college.domain}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentCount || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{postCount || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Domain</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">.{college.domain.split(".").pop()}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Posts</h2>
            </div>

            {posts && posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post as any} currentUserId={user.id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No posts yet from {college.name}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
