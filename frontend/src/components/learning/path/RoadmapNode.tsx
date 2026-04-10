import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useProgress } from "@/hooks/useProgress"
import type { RoadmapNode as RoadmapNodeType } from "@/types"

const TYPE_STYLE: Record<string, { border: string; accent: string }> = {
  skill:   { border: "#3ef07a", accent: "#0a2018" },
  tool:    { border: "#60a5fa", accent: "#0f1f35" },
  concept: { border: "#f59e0b", accent: "#2b2010" },
}

export const RoadmapNodeComponent = memo(({ data }: NodeProps) => {
  const node = data.node as RoadmapNodeType
  const { isComplete } = useProgress()
  const done = isComplete(node.id)
  const locked = data.locked as boolean
  const selected = data.selected as boolean
  const onSelect = data.onSelect as (node: RoadmapNodeType) => void

  const style = TYPE_STYLE[node.type]

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      <div
        onClick={() => !locked && onSelect(node)}
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          background: locked ? "#161616" : done ? style.accent : "#1e1e1e",
          border: `1px solid ${selected ? style.border : done ? style.border + "99" : locked ? "#2a2a2a" : "#363636"}`,
          cursor: locked ? "not-allowed" : "pointer",
          opacity: locked ? 0.45 : 1,
          minWidth: 130,
          maxWidth: 180,
          boxShadow: selected ? `0 0 0 2px ${style.border}44` : "none",
          transition: "all .14s",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Type indicator */}
        <div style={{
          fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em",
          color: locked ? "#555" : style.border,
          marginBottom: 3, fontWeight: 700,
        }}>
          {locked ? "🔒 Locked" : done ? "✅ Done" : node.type}
        </div>

        {/* Label */}
        <div style={{
          fontSize: 11, fontWeight: 700,
          color: locked ? "#555" : "#e8e8e8",
          lineHeight: 1.3,
        }}>
          {node.label}
        </div>

        {/* Skills chips */}
        {!locked && (
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 6 }}>
            {node.skills.slice(0, 2).map(s => (
              <span key={s} style={{
                fontSize: 9, padding: "1px 5px", borderRadius: 4,
                background: "#252525", color: "#555", border: "1px solid #2a2a2a",
              }}>{s}</span>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </>
  )
})

RoadmapNodeComponent.displayName = "RoadmapNode"
