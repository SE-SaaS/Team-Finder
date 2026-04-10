export type Difficulty = "Beginner" | "Intermediate" | "Advanced"
export type ResourceType = "youtube" | "docs" | "article" | "book"
export type CourseStatus = "locked" | "available" | "completed"
export type University = "JU" | "HU"
export type Platform = "Coursera" | "Udemy" | "edX" | "freeCodeCamp" | "Other"

// ─── JU / HU Courses ───────────────────────────────
export interface CourseResource {
  type: ResourceType
  label: string
  url: string
}
export interface CourseBook {
  title: string
  url: string
  type: "free-pdf" | "paid" | "library"
}
export interface UniversityCourse {
  id: string
  university: University
  year: 1 | 2 | 3 | 4
  semester: 1 | 2
  name: string
  description: string
  difficulty: Difficulty
  book: CourseBook
  resources: CourseResource[]
  skills: string[]
  status: CourseStatus
}

// ─── Roadmap ────────────────────────────────────────
export interface RoadmapCourse {
  title: string
  platform: Platform
  url: string
  type: "free" | "paid"
  price?: string              // e.g. "$14.99"
  durationHours?: number
}
export interface Lab {
  title: string
  description: string
  difficulty: Difficulty
  skills: string[]
  estimatedHours: number
}
export interface RoadmapNode {
  id: string
  label: string               // e.g. "CSS Flexbox"
  description: string
  type: "skill" | "tool" | "concept"
  x: number                   // position on canvas
  y: number
  dependsOn: string[]         // IDs of prerequisite nodes
  courses: RoadmapCourse[]
  lab: Lab
  skills: string[]
}
export interface Roadmap {
  id: string
  title: string
  icon: string
  description: string
  nodes: RoadmapNode[]
  edges: { from: string; to: string }[]
}

// ─── Dev Tools ──────────────────────────────────────
export interface DevToolEntry {
  id: string
  title: string
  description: string
  url: string
  category: "github" | "devdocs" | "tools"
  resources: CourseResource[]
}
