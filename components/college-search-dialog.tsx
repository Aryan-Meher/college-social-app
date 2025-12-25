"use client"

import { useState, useEffect } from "react"
import { Search, Building2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"

interface College {
  id: string
  name: string
  domain: string
}

interface CollegeSearchDialogProps {
  selectedCollege: College | null
  onSelectCollege: (college: College) => void
}

export function CollegeSearchDialog({ selectedCollege, onSelectCollege }: CollegeSearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [colleges, setColleges] = useState<College[]>([])
  const [filteredColleges, setFilteredColleges] = useState<College[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadColleges()
    }
  }, [open])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = colleges.filter((college) => college.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredColleges(filtered)
    } else {
      setFilteredColleges(colleges)
    }
  }, [searchQuery, colleges])

  const loadColleges = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from("colleges").select("id, name, domain").order("name")

    if (data && !error) {
      setColleges(data)
      setFilteredColleges(data)
    }
    setIsLoading(false)
  }

  const handleSelectCollege = (college: College) => {
    onSelectCollege(college)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
          <Building2 className="mr-2 h-4 w-4" />
          {selectedCollege ? selectedCollege.name : "Select your college"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Your College</DialogTitle>
          <DialogDescription>Search and select the college or university you attend</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-[300px] rounded-md border">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">Loading colleges...</p>
              </div>
            ) : filteredColleges.length > 0 ? (
              <div className="p-2">
                {filteredColleges.map((college) => (
                  <button
                    key={college.id}
                    onClick={() => handleSelectCollege(college)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-medium">{college.name}</span>
                      <span className="text-xs text-muted-foreground">{college.domain}</span>
                    </div>
                    {selectedCollege?.id === college.id && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">No colleges found</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
