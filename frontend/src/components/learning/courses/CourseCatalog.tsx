import { useState, useMemo } from "react"
import SectionTabs from "@/components/shared/SectionTabs"
import CourseCard from "./CourseCard"
import CourseDetailModal from "./CourseDetailModal"
import { useUnlocks } from "@/hooks/useUnlocks"
import type { UniversityCourse, Difficulty } from "@/types"

const DIFFICULTIES: ("All" | Difficulty)[] = ["All", "Beginner", "Intermediate", "Advanced"]
const YEARS: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4]

interface CourseCatalogProps {
  courses: UniversityCourse[]
  loading: boolean
  userUniversity: "JU" | "HU"
  defaultYear?: number
}

export default function CourseCatalog({ courses, loading, userUniversity, defaultYear }: CourseCatalogProps) {
  const clampedDefaultYear = Math.min(Math.max(defaultYear ?? 1, 1), 4) as 1 | 2 | 3 | 4
  const [uniTab, setUniTab]         = useState<"JU" | "HU" | "EXT">(userUniversity)
  const [year, setYear]             = useState<1 | 2 | 3 | 4>(clampedDefaultYear)
  const [cumulative, setCumulative] = useState(false)
  const [diff, setDiff]             = useState<"All" | Difficulty>("All")
  const [search, setSearch]         = useState("")
  const [selected, setSelected]     = useState<UniversityCourse | null>(null)

  // Compute unlocks once for the whole catalog
  const { courseStatus, lockReason } = useUnlocks({ courses, userYear: defaultYear })

  const filtered = useMemo(() => courses.filter(c => {
    const matchUni  = c.university === uniTab
    const matchYear = cumulative ? c.year <= year : c.year === year
    const matchDiff = diff === "All" || c.difficulty === diff
    const matchQ    = !search
      || c.name.toLowerCase().includes(search.toLowerCase())
      || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    return matchUni && matchYear && matchDiff && matchQ
  }), [courses, uniTab, year, cumulative, diff, search])

  // Tabs: user's own uni + External MOOCs
  const tabsWithCount = useMemo(() => ([
    { label: userUniversity, count: courses.filter(c => c.university === userUniversity).length },
    { label: "EXT",          count: courses.filter(c => c.university === "EXT").length },
  ]), [courses, userUniversity])

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      padding: 60, color: "#555", fontSize: 12 }}>
      Loading...
    </div>
  )

  return (
    <div style={{ background: "transparent", minHeight: "100%", color: "#e8e8e8", fontFamily: "system-ui, sans-serif" }}>

      {/* University Tabs */}
      <SectionTabs tabs={tabsWithCount} active={uniTab} onChange={t => setUniTab(t as "JU" | "HU" | "EXT")} />

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
              {cumulative ? `Through Y${y}` : `Y${y}`}
            </button>
          ))}
          <button onClick={() => setCumulative(c => !c)}
            title={cumulative ? "Show only the selected year" : "Show all years up to the selected year"}
            style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11,
              cursor: "pointer", fontFamily: "inherit",
              background: cumulative ? "#0a2018" : "#1e1e1e",
              border: `1px solid ${cumulative ? "#3ef07a" : "#2a2a2a"}`,
              color: cumulative ? "#3ef07a" : "#909090" }}>
            Cumulative
          </button>
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

      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 10, padding: 16 }}>
          {filtered.map(c => (
            <CourseCard key={c.id} course={c} onClick={setSelected}
              status={courseStatus(c)} lockReason={lockReason(c)} />
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
