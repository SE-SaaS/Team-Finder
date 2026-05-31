import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { UniversityCourse, Difficulty, CourseAffiliation, CourseResource, CourseBook } from "@/types"
import { logger } from "@/lib/logger"

interface CourseRow {
  id: string
  code: string
  name: string
  university: string
  major: string
  year: number
  semester: number
  credit_hours: number | null
  prerequisite_ids: string[] | null
  unlocks_skills: string[] | null
  description: string | null
}

function deriveDifficulty(year: number): Difficulty {
  if (year <= 1) return "Beginner"
  if (year >= 4) return "Advanced"
  return "Intermediate"
}

function normalize(row: CourseRow): UniversityCourse {
  return {
    id: row.id,
    university: row.university as CourseAffiliation,
    year: Math.min(Math.max(row.year, 1), 4) as 1 | 2 | 3 | 4,
    semester: (row.semester === 2 ? 2 : 1) as 1 | 2,
    name: row.name,
    description: row.description ?? "",
    difficulty: deriveDifficulty(row.year),
    book: {} as CourseBook,
    resources: [] as CourseResource[],
    skills: row.unlocks_skills ?? [],
    status: "available",
    prerequisite_ids: row.prerequisite_ids ?? [],
  }
}

export function useCourses() {
  const [courses, setCourses] = useState<UniversityCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error: err } = await supabase
        .from("courses")
        .select("id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description")
        .order("year", { ascending: true })
        .order("semester", { ascending: true })
        .order("code", { ascending: true })

      if (cancelled) return
      if (err) {
        logger.error('[useCourses] Failed to load courses:', err)
        setError(err.message)
        setCourses([])
      } else {
        setCourses((data ?? []).map(normalize))
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { courses, loading, error }
}
