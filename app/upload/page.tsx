"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { getCollegeDomain } from "@/lib/auth-utils"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageIcon, Video, FileText, UploadIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

type PostType = "article" | "photo" | "video"

export default function UploadPage() {
  const [postType, setPostType] = useState<PostType>("article")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userCollegeId, setUserCollegeId] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get user's profile and college
      const { data: profile } = await supabase.from("profiles").select("*, college_id").eq("id", user.id).single()

      if (profile) {
        setUserProfile(profile)
        setUserCollegeId(profile.college_id)
      } else {
        // User doesn't have a profile yet, create one
        const collegeDomain = getCollegeDomain(user.email || "")
        const { data: college } = await supabase.from("colleges").select("id").eq("domain", collegeDomain).single()

        if (college) {
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
            college_id: college.id,
            is_verified: true,
          })
          setUserCollegeId(college.id)
        }
      }
    }

    fetchUserProfile()
  }, [supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Validate file type
      if (postType === "photo" && !selectedFile.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }
      if (postType === "video" && !selectedFile.type.startsWith("video/")) {
        setError("Please select a video file")
        return
      }

      // Validate file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB")
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const uploadFile = async (file: File, userId: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from("uploads").upload(fileName, file)

    if (uploadError) {
      console.error("[v0] Upload error:", uploadError)
      return null
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(fileName)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || !userCollegeId) {
        throw new Error("You must be logged in and verified to post")
      }

      let mediaUrl: string | null = null
      let mediaType: string | null = null

      // Upload file if it's a photo or video
      if ((postType === "photo" || postType === "video") && file) {
        mediaUrl = await uploadFile(file, user.id)
        mediaType = file.type

        if (!mediaUrl) {
          throw new Error("Failed to upload file")
        }
      }

      // Validate content
      if (postType === "article" && !content.trim()) {
        throw new Error("Article content is required")
      }
      if ((postType === "photo" || postType === "video") && !mediaUrl) {
        throw new Error(`${postType === "photo" ? "Image" : "Video"} file is required`)
      }

      // Create post
      const { error: postError } = await supabase.from("posts").insert({
        author_id: user.id,
        college_id: userCollegeId,
        type: postType,
        title: title.trim() || null,
        content: content.trim() || null,
        media_url: mediaUrl,
        media_type: mediaType,
      })

      if (postError) throw postError

      setSuccess(true)
      setTitle("")
      setContent("")
      setFile(null)

      // Redirect to feed after 2 seconds
      setTimeout(() => {
        router.push("/feed")
      }, 2000)
    } catch (error: any) {
      console.error("[v0] Error creating post:", error)
      setError(error.message || "An error occurred while creating your post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-3xl font-bold">Create Post</h1>
            <p className="text-muted-foreground">Share photos, videos, or articles with your campus community</p>
          </div>

          <Tabs
            value={postType}
            onValueChange={(value) => {
              setPostType(value as PostType)
              setFile(null)
              setError(null)
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="article" className="gap-2">
                <FileText className="h-4 w-4" />
                Article
              </TabsTrigger>
              <TabsTrigger value="photo" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Photo
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2">
                <Video className="h-4 w-4" />
                Video
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="mt-6">
              <TabsContent value="article" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Write an Article</CardTitle>
                    <CardDescription>Share your thoughts, guides, or stories with the campus</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="article-title">Title (Optional)</Label>
                      <Input
                        id="article-title"
                        placeholder="Give your article a title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="article-content">Content</Label>
                      <Textarea
                        id="article-content"
                        placeholder="Write your article here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={12}
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload a Photo</CardTitle>
                    <CardDescription>Share an image with your campus community</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="photo-title">Title (Optional)</Label>
                      <Input
                        id="photo-title"
                        placeholder="Give your photo a title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo-caption">Caption (Optional)</Label>
                      <Textarea
                        id="photo-caption"
                        placeholder="Add a caption to your photo..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo-file">Image File</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="photo-file"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="cursor-pointer"
                        />
                        {file && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground">Accepted: JPG, PNG, GIF (Max 50MB)</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="video" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload a Video</CardTitle>
                    <CardDescription>Share a video with your campus community</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-title">Title (Optional)</Label>
                      <Input
                        id="video-title"
                        placeholder="Give your video a title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="video-description">Description (Optional)</Label>
                      <Textarea
                        id="video-description"
                        placeholder="Describe your video..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="video-file">Video File</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="video-file"
                          type="file"
                          accept="video/*"
                          onChange={handleFileChange}
                          required
                          className="cursor-pointer"
                        />
                        {file && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground">Accepted: MP4, MOV, AVI (Max 50MB)</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 border-green-500 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Post created successfully! Redirecting to feed...</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 mt-6">
                <Button type="submit" className="flex-1 gap-2" disabled={isLoading || !userCollegeId}>
                  <UploadIcon className="h-4 w-4" />
                  {isLoading ? "Publishing..." : "Publish Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/feed")} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
