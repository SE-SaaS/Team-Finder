import { useState } from "react"
import GoalSelector from "./GoalSelector"
import RoadmapViewer from "./RoadmapViewer"
import ProgressBar from "@/components/shared/ProgressBar"
import { useRoadmap } from "@/hooks/useRoadmap"
import { useProgress } from "@/hooks/useProgress"
import { useRoadmaps } from "@/hooks/useRoadmaps"

export default function PersonalizedPath() {
  const [goalId, setGoalId] = useState<string | null>(null)
  const { roadmaps, loading } = useRoadmaps()
  const { roadmap, progressPercent, completedNodes } = useRoadmap(goalId ?? "", roadmaps)
  const { markComplete } = useProgress()

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      padding: 60, color: "#555", fontSize: 12 }}>
      Loading...
    </div>
  )

  if (!goalId || !roadmap) {
    return <GoalSelector onSelect={setGoalId} />
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #2a2a2a",
        background: "#161616", display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => setGoalId(null)}
          style={{ background: "none", border: "1px solid #2a2a2a", borderRadius: 6,
            color: "#909090", fontSize: 11, padding: "4px 10px", cursor: "pointer",
            fontFamily: "inherit" }}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>
            {roadmap.icon} {roadmap.title}
          </div>
          <ProgressBar
            percent={progressPercent}
            label={`${completedNodes.length} / ${roadmap.nodes.length} nodes complete`}
          />
        </div>
      </div>

      {/* Roadmap canvas */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <RoadmapViewer
          roadmap={roadmap}
          completedNodes={completedNodes.map(n => n.id)}
          onMarkComplete={markComplete}
        />
      </div>
    </div>
  )
}
