import ProgressBar from "@/components/shared/ProgressBar"
import { useProgress } from "@/hooks/useProgress"
import type { UniversityCourse } from "@/types"

interface CourseCardProps {
  course: UniversityCourse
  onClick: (course: UniversityCourse) => void
}

const DIFF_STYLE: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: "#0d2216", color: "#3ef07a" },
  Intermediate: { bg: "#2b2010", color: "#f59e0b" },
  Advanced:     { bg: "#2b1515", color: "#ef4444" },
}

const STATUS_ICON: Record<string, string> = {
  locked:    "🔒",
  available: "📖",
  completed: "✅",
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  const { isComplete } = useProgress()
  const done = isComplete(course.id)
  const diff = DIFF_STYLE[course.difficulty]

  return (
    <div
      onClick={() => course.status !== "locked" && onClick(course)}
      style={{
        background: "#1e1e1e",
        border: `1px solid ${done ? "#1a4f30" : "#2a2a2a"}`,
        borderRadius: 8, padding: 12,
        cursor: course.status === "locked" ? "not-allowed" : "pointer",
        opacity: course.status === "locked" ? 0.5 : 1,
        transition: "all .14s",
      }}
      onMouseEnter={e => { if (course.status !== "locked") (e.currentTarget as HTMLDivElement).style.borderColor = "#363636" }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = done ? "#1a4f30" : "#2a2a2a" }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 12, lineHeight: 1.4, flex: 1, marginRight: 6 }}>
          {course.name}
        </span>
        <span style={{ fontSize: 14 }}>{STATUS_ICON[course.status]}</span>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 9, background: "#252525", color: "#555", padding: "1px 6px", borderRadius: 4 }}>
          Y{course.year} S{course.semester}
        </span>
        <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, ...diff, fontWeight: 600 }}>
          {course.difficulty}
        </span>
        <span style={{ fontSize: 9, background: "#252525", color: "#909090", padding: "1px 6px", borderRadius: 4 }}>
          {course.university}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 11, color: "#909090", lineHeight: 1.5, marginBottom: 8,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {course.description}
      </p>

      {/* Skills */}
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 8 }}>
        {course.skills.map(s => (
          <span key={s} style={{ fontSize: 10, background: "#161616", border: "1px solid #2a2a2a",
            color: "#909090", padding: "1px 6px", borderRadius: 4 }}>
            {s}
          </span>
        ))}
      </div>

      {/* Resource icons */}
      <div style={{ display: "flex", gap: 6, fontSize: 10, color: "#555" }}>
        <span title="Book">📖 Book</span>
        {course.resources.some(r => r.type === "youtube") && <span title="YouTube">▶ Video</span>}
        {course.resources.some(r => r.type === "docs")    && <span title="Docs">📄 Docs</span>}
      </div>
    </div>
  )
}
