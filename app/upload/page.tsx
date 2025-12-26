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
import { ImageIcon, Video, FileText, UploadIcon, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

type PostType = "article" | "photo" | "video"

export default function UploadPage() {
  const [postType, setPostType] = useState<PostType>("photo")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userCollegeId, setUserCollegeId] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>("")

  const router = useRouter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setError("Please log in to upload content")
          return
        }

        const { data: profile } = await supabase.from("profiles").select("*, college_id").eq("id", user.id).single()

        if (profile) {
          setUserCollegeId(profile.college_id)
        } else {
          const collegeDomain = getCollegeDomain(user.email || "")
          const { data: college } = await supabase.from("colleges").select("id").eq("domain", collegeDomain).single()

          if (college) {
            const { error: insertError } = await supabase.from("profiles").insert({
              id: user.id,
              email: user.email,
              display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
              college_id: college.id,
              is_verified: true,
            })

            if (!insertError) {
              setUserCollegeId(college.id)
            }
          }
        }
      } catch (err: any) {
        setError("Failed to load user profile")
      }
    }

    fetchUserProfile()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (postType === "photo" && !selectedFile.type.startsWith("image/")) {
        setError("Please select an image file (JPG, PNG, GIF)")
        return
      }
      if (postType === "video" && !selectedFile.type.startsWith("video/")) {
        setError("Please select a video file (MP4, MOV)")
        return
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB")
        return
      }

      setFile(selectedFile)

      if (postType === "photo") {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setUploadProgress("Initializing...")

    try {
      const supabase = createClient()

      setUploadProgress("Checking authentication...")
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to post")
      }

      if (!userCollegeId) {
        throw new Error("Could not determine your college affiliation")
      }

      let mediaUrl: string | null = null
      let mediaType: string | null = null

      if ((postType === "photo" || postType === "video") && file) {
        setUploadProgress("Uploading file to storage...")

        const fileExt = file.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage.from("uploads").upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`)
        }

        if (!uploadData) {
          throw new Error("Upload succeeded but no data returned")
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("uploads").getPublicUrl(uploadData.path)

        mediaUrl = publicUrl
        mediaType = file.type

        setUploadProgress("File uploaded successfully!")
      }

      if (postType === "article" && !content.trim()) {
        throw new Error("Article content is required")
      }
      if ((postType === "photo" || postType === "video") && !mediaUrl) {
        throw new Error(`Please select a ${postType} file to upload`)
      }

      setUploadProgress("Creating post...")
      const { error: postError } = await supabase.from("posts").insert({
        author_id: user.id,
        college_id: userCollegeId,
        type: postType,
        title: title.trim() || null,
        content: content.trim() || null,
        media_url: mediaUrl,
        media_type: mediaType,
      })

      if (postError) {
        throw new Error(`Failed to create post: ${postError.message}`)
      }

      setSuccess(true)
      setUploadProgress("Post published successfully!")

      setTitle("")
      setContent("")
      setFile(null)
      setPreviewUrl(null)

      setTimeout(() => {
        router.push("/feed")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "An error occurred while creating your post")
      setUploadProgress("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="container py-8 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-3xl md:text-4xl font-bold">Create Post</h1>
            <p className="text-muted-foreground">Share photos, videos, or articles with your campus community</p>
          </div>

          <Tabs
            value={postType}
            onValueChange={(value) => {
              setPostType(value as PostType)
              setFile(null)
              setPreviewUrl(null)
              setError(null)
            }}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="article" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Article</span>
              </TabsTrigger>
              <TabsTrigger value="photo" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Photo</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Video</span>
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
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleFileChange}
                          required
                          className="cursor-pointer"
                        />
                        {file && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">Accepted: JPG, PNG, GIF, WebP (Max 50MB)</p>

                      {previewUrl && (
                        <div className="mt-4 rounded-lg border overflow-hidden">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-auto max-h-96 object-contain"
                          />
                        </div>
                      )}
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
                          accept="video/mp4,video/mov,video/avi"
                          onChange={handleFileChange}
                          required
                          className="cursor-pointer"
                        />
                        {file && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">Accepted: MP4, MOV, AVI (Max 50MB)</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {error && (
                <Alert variant="destructive" className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 border-green-500 bg-green-50 text-green-600 animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Post created successfully! Redirecting to feed...</AlertDescription>
                </Alert>
              )}

              {isLoading && uploadProgress && (
                <Alert className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>{uploadProgress}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 mt-6">
                <Button type="submit" className="flex-1 gap-2" disabled={isLoading || !userCollegeId}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="h-4 w-4" />
                      Publish Post
                    </>
                  )}
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
