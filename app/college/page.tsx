import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function CollegesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all colleges with post counts
  const { data: colleges, error } = await supabase
    .from("colleges")
    .select("*, posts:posts(count)")
    .order("name", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching colleges:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Browse Colleges</h1>
            <p className="text-muted-foreground">Explore content from different college communities</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {colleges &&
              colleges.map((college) => {
                const postCount = Array.isArray(college.posts) ? college.posts.length : 0

                return (
                  <Card key={college.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{college.name}</CardTitle>
                          <CardDescription className="mt-1">{college.domain}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {postCount} {postCount === 1 ? "post" : "posts"}
                      </div>
                      <Link href={`/college/${college.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          View Page
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      </main>
    </div>
  )
}
