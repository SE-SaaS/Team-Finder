import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface MasterSkill {
  name: string
  category: string | null
}

export function useSkills() {
  const [skills, setSkills] = useState<MasterSkill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    supabase
      .from("skills")
      .select("name, category")
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error("useSkills: failed to load skills", error)
          setSkills([])
        } else {
          setSkills(data ?? [])
        }
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { skills, loading }
}
