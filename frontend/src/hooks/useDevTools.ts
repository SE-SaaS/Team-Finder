import { useState, useEffect } from "react"
import type { DevToolEntry } from "@/types"
import { devTools as localDevTools } from "@/data/dev_tools"

export function useDevTools() {
  const [devTools, setDevTools] = useState<DevToolEntry[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/dev-tools")
        if (!res.ok) throw new Error("Failed")
        setDevTools(await res.json())
      } catch {
        setDevTools(localDevTools)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  return { devTools, loading }
}
