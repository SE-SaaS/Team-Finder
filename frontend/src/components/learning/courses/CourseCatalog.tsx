import { useState, useMemo } from "react"
import SectionTabs from "@/components/shared/SectionTabs"
import CourseCard from "./CourseCard"
import CourseDetailModal from "./CourseDetailModal"
import { useProgress } from "@/hooks/useProgress"
import type { UniversityCourse, Difficulty } from "@/types"

const DIFFICULTIES: ("All" | Difficulty)[] = ["All", "Beginner", "Intermediate", "Advanced"]
const YEARS = [0, 1, 2, 3, 4] // 0 = All

interface CourseCatalogProps {
  courses: UniversityCourse[]
  loading: boolean
}

export default function CourseCatalog({ courses, loading }: CourseCatalogProps) {
  const [uniTab, setUniTab]         = useState("Both")
  const [year, setYear]             = useState(0)
  const [diff, setDiff]             = useState<"All" | Difficulty>("All")
  const [search, setSearch]         = useState("")
  const [selected, setSelected]     = useState<UniversityCourse | null>(null)

  // Load progress once at parent level instead of in every card
  const { isComplete } = useProgress()

  const filtered = useMemo(() => courses.filter(c => {
    const matchUni  = uniTab === "Both" || c.university === uniTab
    const matchYear = year === 0 || c.year === year
    const matchDiff = diff === "All" || c.difficulty === diff
    const matchQ    = !search
      || c.name.toLowerCase().includes(search.toLowerCase())
      || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    return matchUni && matchYear && matchDiff && matchQ
  }), [courses, uniTab, year, diff, search])

  // Memoize tab counts to prevent recalculation on every render
  const tabsWithCount = useMemo(() => ["Both", "JU", "HU"].map(label => ({
    label,
    count: courses.filter(c => label === "Both" || c.university === label).length,
  })), [courses])

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      padding: 60, color: "#555", fontSize: 12 }}>
      Loading...
    </div>
  )

  return (
    <div style={{ background: "#0c0c0c", minHeight: "100%", color: "#e8e8e8", fontFamily: "system-ui, sans-serif" }}>

      {/* University Tabs */}
      <SectionTabs tabs={tabsWithCount} active={uniTab} onChange={setUniTab} />

      {/* Filters */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #2a2a2a",
        display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", background: "#161616" }}>

        {/* Search */}
        <input
          type="text" placeholder="Search courses or skills..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 160, background: "#1e1e1e", border: "1px solid #2a2a2a",
            borderRadius: 6, padding: "5px 10px", color: "#e8e8e8", fontSize: 12,
            outline: "none", fontFamily: "inherit" }}
        />

        {/* Year */}
        <div style={{ display: "flex", gap: 4 }}>
          {YEARS.map(y => (
            <button key={y} onClick={() => setYear(y)}
              style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11,
                cursor: "pointer", fontFamily: "inherit",
                background: year === y ? "#0a2018" : "#1e1e1e",
                border: `1px solid ${year === y ? "#3ef07a" : "#2a2a2a"}`,
                color: year === y ? "#3ef07a" : "#909090" }}>
              {y === 0 ? "All Years" : `Y${y}`}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <div style={{ display: "flex", gap: 4 }}>
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setDiff(d)}
              style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11,
                cursor: "pointer", fontFamily: "inherit",
                background: diff === d ? "#0a2018" : "#1e1e1e",
                border: `1px solid ${diff === d ? "#3ef07a" : "#2a2a2a"}`,
                color: diff === d ? "#3ef07a" : "#909090" }}>
              {d}
            </button>
          ))}
        </div>

        <span style={{ fontSize: 10, color: "#555", marginLeft: "auto" }}>
          {filtered.length} course{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 10, padding: 16 }}>
          {filtered.map(c => (
            <CourseCard key={c.id} course={c} onClick={setSelected} isComplete={isComplete(c.id)} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
          padding: "60px 20px", color: "#555", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.4 }}>📚</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#909090", marginBottom: 4 }}>No courses found</div>
          <div style={{ fontSize: 11 }}>Try adjusting your filters</div>
        </div>
      )}

      {/* Modal */}
      {selected && <CourseDetailModal course={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
