import ResourceLink from "@/components/shared/ResourceLink"
import { useDevTools } from "@/hooks/useDevTools"

export default function DevDocsExplorer() {
  const { devTools, loading } = useDevTools()
  const docs = devTools.filter(d => d.category === "devdocs")

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      padding: 60, color: "#555", fontSize: 12 }}>
      Loading...
    </div>
  )

  return (
    <div>
      <h2 style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>📄 Dev Docs & Research Skills</h2>
      <p style={{ fontSize: 11, color: "#909090", marginBottom: 16, lineHeight: 1.6 }}>
        Knowing how to read documentation and search effectively is a core developer skill.
        These resources will save you hours every week.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10 }}>
        {docs.map(doc => (
          <div key={doc.id} style={{ background: "#1e1e1e", border: "1px solid #2a2a2a",
            borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{doc.title}</div>
            <p style={{ fontSize: 11, color: "#909090", lineHeight: 1.5, marginBottom: 12 }}>
              {doc.description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {doc.resources.map(r => <ResourceLink key={r.url} resource={r} size="sm" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
