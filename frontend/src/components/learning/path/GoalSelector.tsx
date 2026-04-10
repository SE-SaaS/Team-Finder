import type { Roadmap } from "@/types"
import { useRoadmaps } from "@/hooks/useRoadmaps"

interface GoalSelectorProps {
  onSelect: (goalId: string) => void
}

const GOAL_DESCRIPTIONS: Record<string, string> = {
  "fullstack-web": "Build complete web apps — frontend, backend, and everything in between.",
  "ai-ml":         "Train models, work with data, and build intelligent systems.",
  "cybersecurity": "Protect systems, find vulnerabilities, and understand how attacks work.",
  "mobile":        "Ship apps to iOS and Android from a single codebase or natively.",
  "data-science":  "Analyze data, build dashboards, and extract insights at scale.",
  "game-dev":      "Create interactive experiences with game engines like Unity or Unreal.",
}

export default function GoalSelector({ onSelect }: GoalSelectorProps) {
  const { roadmaps, loading } = useRoadmaps()

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      padding: 60, color: "#555", fontSize: 12 }}>
      Loading...
    </div>
  )

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, letterSpacing: -0.3 }}>
        What do you want to build?
      </h2>
      <p style={{ fontSize: 12, color: "#909090", marginBottom: 24, lineHeight: 1.6 }}>
        Pick a goal. We'll give you a visual roadmap with labs and courses for every step.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {roadmaps.map((roadmap: Roadmap) => (
          <button
            key={roadmap.id}
            onClick={() => onSelect(roadmap.id)}
            style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 10,
              padding: 20, textAlign: "left", cursor: "pointer", transition: "all .14s",
              fontFamily: "inherit" }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.borderColor = "#3ef07a"
              el.style.background = "#0a2018"
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.borderColor = "#2a2a2a"
              el.style.background = "#161616"
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{roadmap.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: "#e8e8e8" }}>
              {roadmap.title}
            </div>
            <p style={{ fontSize: 11, color: "#909090", lineHeight: 1.5, marginBottom: 12 }}>
              {GOAL_DESCRIPTIONS[roadmap.id] ?? roadmap.description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {roadmap.nodes.slice(0, 4).map(n => (
                <span key={n.id} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4,
                  background: "#252525", color: "#555", border: "1px solid #2a2a2a" }}>
                  {n.label}
                </span>
              ))}
              {roadmap.nodes.length > 4 && (
                <span style={{ fontSize: 9, color: "#555" }}>+{roadmap.nodes.length - 4} more</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
