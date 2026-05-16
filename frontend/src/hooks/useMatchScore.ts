import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { finalScore, type Student, type MatchScore } from "@/algorithm"

interface ProjectLike {
  required_skills?: string[] | null
  tech_stack?: string[] | null
}

export function useMatchScore() {
  const { user } = useAuth()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    if (!user) { setLoading(false); return }

    async function load() {
      const [profileRes, skillsRes, profRes] = await Promise.all([
        supabase.from("profiles").select("availability").eq("id", user!.id).single(),
        supabase.from("user_skills").select("skill_name").eq("user_id", user!.id),
        supabase.from("skill_proficiencies").select("rating").eq("user_id", user!.id),
      ])

      if (cancelled) return

      const availability = profileRes.data?.availability ?? ""
      const skills = (skillsRes.data ?? []).map(r => r.skill_name).filter(Boolean)
      const ratings = (profRes.data ?? []).map(r => r.rating).filter(r => typeof r === "number")
      // skill_proficiencies.rating is 0-100; algorithm wants 1-5
      const avg100 = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 60
      const rating = Math.max(1, Math.min(5, avg100 / 20))

      setStudent({ skills, rating, availability })
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [user])

  const scoreFor = useCallback((project: ProjectLike): MatchScore | null => {
    if (!student) return null
    const skills = project.required_skills?.length ? project.required_skills : (project.tech_stack ?? [])
    if (!skills.length) return null
    return finalScore(skills, student)
  }, [student])

  const hasProfile = !!student && student.skills.length > 0

  return { scoreFor, loading, hasProfile }
}
