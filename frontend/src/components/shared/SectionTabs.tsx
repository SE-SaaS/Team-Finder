interface Tab {
  label: string
  count?: number    // optional badge count
}

interface SectionTabsProps {
  tabs: (string | Tab)[]
  active: string
  onChange: (tab: string) => void
}

export default function SectionTabs({ tabs, active, onChange }: SectionTabsProps) {
  const normalized: Tab[] = tabs.map(t =>
    typeof t === "string" ? { label: t } : t
  )

  return (
    <div style={{
      display: "flex", borderBottom: "1px solid #2a2a2a",
      background: "#161616",
    }}>
      {normalized.map(tab => {
        const isActive = active === tab.label
        return (
          <button
            key={tab.label}
            onClick={() => onChange(tab.label)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 16px",
              background: "none", border: "none",
              borderBottom: `2px solid ${isActive ? "#3ef07a" : "transparent"}`,
              color: isActive ? "#e8e8e8" : "#909090",
              fontSize: 12, cursor: "pointer",
              transition: "all .12s", whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 10,
                background: isActive ? "#0a2018" : "#1e1e1e",
                color: isActive ? "#3ef07a" : "#555",
              }}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
