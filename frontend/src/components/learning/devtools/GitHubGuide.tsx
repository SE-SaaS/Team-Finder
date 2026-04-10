import { useState } from "react"
import ResourceLink from "@/components/shared/ResourceLink"
import { useDevTools } from "@/hooks/useDevTools"

export default function GitHubGuide() {
  const { devTools, loading } = useDevTools()
  const [open, setOpen] = useState<string | null>("git-what-is")
  const modules = devTools.filter(d => d.category === "github")

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      padding: 60, color: "#555", fontSize: 12 }}>
      Loading...
    </div>
  )

  return (
    <div>
      <h2 style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>🐙 GitHub Guide</h2>
      <p style={{ fontSize: 11, color: "#909090", marginBottom: 16, lineHeight: 1.6 }}>
        Version control is non-negotiable as a developer. Work through these modules in order.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {modules.map((mod, i) => {
          const isOpen = open === mod.id
          return (
            <div key={mod.id} style={{ background: "#1e1e1e", border: `1px solid ${isOpen ? "#363636" : "#2a2a2a"}`,
              borderRadius: 8, overflow: "hidden" }}>

              {/* Accordion header */}
              <button
                onClick={() => setOpen(isOpen ? null : mod.id)}
                style={{ width: "100%", padding: "10px 14px", background: "none", border: "none",
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                  color: "#e8e8e8", fontFamily: "inherit", textAlign: "left" }}>
                <span style={{ fontSize: 11, color: "#555", minWidth: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{mod.title}</span>
                <span style={{ color: "#555", fontSize: 12, transition: "transform .2s",
                  transform: isOpen ? "rotate(90deg)" : "none" }}>›</span>
              </button>

              {/* Accordion body */}
              {isOpen && (
                <div style={{ padding: "0 14px 14px", borderTop: "1px solid #2a2a2a" }}>
                  <p style={{ fontSize: 11, color: "#909090", lineHeight: 1.6, margin: "10px 0 12px" }}>
                    {mod.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {mod.resources.map(r => <ResourceLink key={r.url} resource={r} />)}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
