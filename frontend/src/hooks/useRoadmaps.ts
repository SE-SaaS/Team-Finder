import { useState, useEffect } from "react"
import type { Roadmap } from "@/types"
import { roadmaps as localRoadmaps } from "@/data/roadmaps"

export function useRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function fetch_() {
      try {
        const res  = await fetch("/api/roadmaps")
        if (!res.ok) throw new Error("Failed")
        setRoadmaps(await res.json())
      } catch {
        setRoadmaps(localRoadmaps)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  return { roadmaps, loading }
}
