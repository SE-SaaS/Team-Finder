import type { CourseResource, ResourceType } from "@/types"

interface ResourceLinkProps {
  resource: CourseResource
  size?: "sm" | "md"
}

const CONFIG: Record<ResourceType, { icon: string; color: string; bg: string }> = {
  youtube:  { icon: "▶",  color: "#ef4444", bg: "#2b1515" },
  docs:     { icon: "📄", color: "#60a5fa", bg: "#111827" },
  article:  { icon: "📝", color: "#f59e0b", bg: "#2b2010" },
  book:     { icon: "📖", color: "#a78bfa", bg: "#1e1b2e" },
}

export default function ResourceLink({ resource, size = "md" }: ResourceLinkProps) {
  const cfg = CONFIG[resource.type]
  const padding = size === "sm" ? "2px 8px" : "4px 12px"
  const fontSize = size === "sm" ? "10px" : "11px"

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding,
        borderRadius: 6,
        background: cfg.bg,
        border: `1px solid ${cfg.color}33`,
        color: cfg.color,
        fontSize,
        textDecoration: "none",
        transition: "opacity .12s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >
      <span>{cfg.icon}</span>
      <span>{resource.label}</span>
    </a>
  )
}
