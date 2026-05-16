import { useMemo } from "react"
import { useProgress } from "./useProgress"
import type { UniversityCourse } from "@/types"

export type CourseStatus = "completed" | "locked-year" | "locked-prereq" | "available"
export type SkillStatus  = "earned" | "locked"

interface UseUnlocksArgs {
  courses: UniversityCourse[]
  userYear?: number
}

export function useUnlocks({ courses, userYear }: UseUnlocksArgs) {
  const { isComplete } = useProgress()

  const completedSet = useMemo(() => {
    const s = new Set<string>()
    for (const c of courses) if (isComplete(c.id)) s.add(c.id)
    return s
  }, [courses, isComplete])

  const earnedSkills = useMemo(() => {
    const s = new Set<string>()
    for (const c of courses) {
      if (!completedSet.has(c.id)) continue
      for (const sk of c.skills ?? []) s.add(sk)
    }
    return s
  }, [courses, completedSet])

  const prereqMap = useMemo(() => {
    const m = new Map<string, string[]>()
    for (const c of courses) m.set(c.id, c.prerequisite_ids ?? [])
    return m
  }, [courses])

  function courseStatus(course: UniversityCourse): CourseStatus {
    if (completedSet.has(course.id)) return "completed"
    if (userYear !== undefined && course.year > userYear) return "locked-year"
    const prereqs = prereqMap.get(course.id) ?? []
    if (prereqs.length && !prereqs.every(p => completedSet.has(p))) return "locked-prereq"
    return "available"
  }

  function lockReason(course: UniversityCourse): string {
    const s = courseStatus(course)
    if (s === "locked-year")
      return `Y${course.year} course - you're in Y${userYear ?? "?"}`
    if (s === "locked-prereq") {
      const missing = (prereqMap.get(course.id) ?? []).filter(p => !completedSet.has(p))
      const names = missing
        .map(id => courses.find(c => c.id === id)?.name ?? id)
        .slice(0, 2)
        .join(", ")
      return `Requires: ${names}${missing.length > 2 ? "..." : ""}`
    }
    return ""
  }

  function skillStatus(skillName: string): SkillStatus {
    return earnedSkills.has(skillName) ? "earned" : "locked"
  }

  return { courseStatus, skillStatus, lockReason, earnedSkills, completedSet }
}
