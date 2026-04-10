import ResourceLink from "@/components/shared/ResourceLink"
import { useProgress } from "@/hooks/useProgress"
import type { UniversityCourse, ResourceType } from "@/types"

interface CourseDetailModalProps {
  course: UniversityCourse
  onClose: () => void
}

const TYPE_LABELS: Record<ResourceType, string> = {
  youtube: "▶ Videos",
  docs:    "📄 Documentation",
  article: "📝 Articles",
  book:    "📖 Books",
}

export default function CourseDetailModal({ course, onClose }: CourseDetailModalProps) {
  const { isComplete, markComplete } = useProgress()
  const done = isComplete(course.id)

  // Group resources by type
  const grouped = course.resources.reduce<Partial<Record<ResourceType, typeof course.resources>>>(
    (acc, r) => ({ ...acc, [r.type]: [...(acc[r.type] ?? []), r] }),
    {}
  )

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div style={{
        background: "#161616", border: "1px solid #363636",
        borderRadius: 12, padding: 24,
        width: 520, maxWidth: "100%", maxHeight: "85vh",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, letterSpacing: -0.3 }}>{course.name}</h2>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: 10, color: "#909090" }}>{course.university} · Year {course.year}, Sem {course.semester}</span>
              <span style={{ fontSize: 10, color: "#909090" }}>· {course.difficulty}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#909090",
            fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {/* Description */}
        <p style={{ fontSize: 12, color: "#909090", lineHeight: 1.6, marginBottom: 20 }}>
          {course.description}
        </p>

        {/* Book */}
        <section style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em",
            color: "#555", marginBottom: 10, fontWeight: 700 }}>📖 Course Book</h3>
          <div style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 8, padding: 12,
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{course.book.title}</div>
              <div style={{ fontSize: 10, color: "#555" }}>
                {course.book.type === "free-pdf" ? "✅ Free PDF" : course.book.type === "paid" ? "💳 Paid" : "🏛 Library"}
              </div>
            </div>
            <a href={course.book.url} target="_blank" rel="noopener noreferrer"
              style={{ padding: "5px 12px", borderRadius: 6, background: "#0a2018",
                border: "1px solid #1a4f30", color: "#3ef07a", fontSize: 11, textDecoration: "none" }}>
              Open →
            </a>
          </div>
        </section>

        {/* Resources grouped by type */}
        {(Object.entries(grouped) as [ResourceType, typeof course.resources][]).map(([type, items]) => (
          <section key={type} style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em",
              color: "#555", marginBottom: 8, fontWeight: 700 }}>{TYPE_LABELS[type]}</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {items.map(r => <ResourceLink key={r.url} resource={r} />)}
            </div>
          </section>
        ))}

        {/* Footer */}
        <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: 16, marginTop: 8 }}>
          {done ? (
            <div style={{ textAlign: "center", color: "#3ef07a", fontSize: 12, fontWeight: 700 }}>
              ✅ Marked as Complete
            </div>
          ) : (
            <button
              onClick={() => markComplete(course.id)}
              style={{ width: "100%", padding: "9px", borderRadius: 8,
                background: "#3ef07a", color: "#0a0a0a", border: "none",
                fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              ✅ Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
