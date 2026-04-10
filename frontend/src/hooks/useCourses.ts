import { useState, useEffect } from "react"
import type { UniversityCourse } from "@/types"
import { juCourses } from "@/data/ju_courses"
import { huCourses } from "@/data/hu_courses"

export function useCourses() {
  const [courses, setCourses] = useState<UniversityCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function fetch_() {
      try {
        const res  = await fetch("/api/courses")
        if (!res.ok) throw new Error("Failed")
        const data = await res.json()
        setCourses(data)
      } catch {
        // Fallback to local data
        setCourses([...juCourses, ...huCourses])
        setError("Using local data — DB unavailable")
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  return { courses, loading, error }
}
