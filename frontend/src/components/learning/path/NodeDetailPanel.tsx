import { useProgress } from "@/hooks/useProgress"
import type { RoadmapNode } from "@/types"

const PLATFORM_STYLE: Record<string, { bg: string; color: string }> = {
  Coursera:     { bg: "#0f1f35", color: "#60a5fa" },
  Udemy:        { bg: "#2b1a0f", color: "#f97316" },
  edX:          { bg: "#1a0f2b", color: "#a78bfa" },
  freeCodeCamp: { bg: "#0d2216", color: "#3ef07a" },
  Other:        { bg: "#252525", color: "#909090" },
}

const DIFF_COLOR: Record<string, string> = {
  Beginner:     "#3ef07a",
  Intermediate: "#f59e0b",
  Advanced:     "#ef4444",
}

interface NodeDetailPanelProps {
  node: RoadmapNode
  onClose: () => void
}

export default function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  const { isComplete, markComplete } = useProgress()
  const done = isComplete(node.id)

  return (
    <div style={{
      width: 320, height: "100%",
      background: "#161616", borderLeft: "1px solid #2a2a2a",
      overflowY: "auto", display: "flex", flexDirection: "column",
      fontFamily: "system-ui, sans-serif", color: "#e8e8e8",
      animation: "slideIn .2s ease",
    }}>
      <style>{`@keyframes slideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>

      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #2a2a2a",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em",
            color: "#555", marginBottom: 4, fontWeight: 700 }}>{node.type}</div>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.3 }}>{node.label}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none",
          color: "#555", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 2px" }}>×</button>
      </div>

      {/* Description */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #2a2a2a" }}>
        <p style={{ fontSize: 11, color: "#909090", lineHeight: 1.6 }}>{node.description}</p>
      </div>

      {/* Lab */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #2a2a2a" }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
          color: "#555", fontWeight: 700, marginBottom: 10 }}>🧪 Lab</div>

        <div style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{node.lab.title}</div>
          <p style={{ fontSize: 11, color: "#909090", lineHeight: 1.5, marginBottom: 10 }}>
            {node.lab.description}
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, fontWeight: 600,
              color: DIFF_COLOR[node.lab.difficulty],
              background: DIFF_COLOR[node.lab.difficulty] + "22",
              border: `1px solid ${DIFF_COLOR[node.lab.difficulty]}44` }}>
              {node.lab.difficulty}
            </span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4,
              background: "#252525", color: "#909090", border: "1px solid #2a2a2a" }}>
              ⏱ ~{node.lab.estimatedHours}h
            </span>
            {node.lab.skills.map(s => (
              <span key={s} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4,
                background: "#252525", color: "#555", border: "1px solid #2a2a2a" }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Courses */}
      <div style={{ padding: "12px 16px", flex: 1 }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
          color: "#555", fontWeight: 700, marginBottom: 10 }}>🎓 Courses</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {node.courses.map((course, i) => {
            const ps = PLATFORM_STYLE[course.platform] ?? PLATFORM_STYLE.Other
            return (
              <div key={i} style={{ background: "#1e1e1e", border: "1px solid #2a2a2a",
                borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, flex: 1, marginRight: 6,
                    lineHeight: 1.3 }}>{course.title}</span>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4,
                    background: ps.bg, color: ps.color, border: `1px solid ${ps.color}44`,
                    whiteSpace: "nowrap", fontWeight: 600 }}>{course.platform}</span>
                </div>

                <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4,
                    background: course.type === "free" ? "#0d2216" : "#2b2010",
                    color: course.type === "free" ? "#3ef07a" : "#f59e0b",
                    border: `1px solid ${course.type === "free" ? "#1a4f30" : "#4a3010"}` }}>
                    {course.type === "free" ? "Free" : course.price ?? "Paid"}
                  </span>
                  {course.durationHours && (
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4,
                      background: "#252525", color: "#909090", border: "1px solid #2a2a2a" }}>
                      ⏱ {course.durationHours}h
                    </span>
                  )}
                </div>

                <a href={course.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", textAlign: "center", padding: "5px",
                    borderRadius: 6, background: "#252525", border: "1px solid #363636",
                    color: "#e8e8e8", fontSize: 11, textDecoration: "none",
                    transition: "all .12s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#555")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#363636")}>
                  Open Course →
                </a>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer — Mark Complete */}
      <div style={{ padding: 16, borderTop: "1px solid #2a2a2a" }}>
        {done ? (
          <div style={{ textAlign: "center", color: "#3ef07a", fontSize: 12, fontWeight: 700 }}>
            ✅ Node Complete
          </div>
        ) : (
          <button onClick={() => markComplete(node.id)}
            style={{ width: "100%", padding: 9, borderRadius: 8,
              background: "#3ef07a", color: "#0a0a0a", border: "none",
              fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            ✅ Mark as Complete
          </button>
        )}
      </div>
    </div>
  )
}
