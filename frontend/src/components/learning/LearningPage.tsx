import SectionTabs from "@/components/shared/SectionTabs"
import CourseCatalog from "./courses/CourseCatalog"
import DevToolsHub from "./devtools/DevToolsHub"
import PersonalizedPath from "./path/PersonalizedPath"
import { useState } from "react"
import { useCourses } from "@/hooks/useCourses"

export default function LearningPage() {
  const [tab, setTab] = useState("Courses")
  const { courses } = useCourses()

  const TABS = [
    { label: "Courses",    count: courses.length },
    { label: "Dev Tools",  count: 10 },
    { label: "My Path" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%",
      background: "#0c0c0c", color: "#e8e8e8", fontFamily: "system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ padding: "14px 18px 0", background: "#0c0c0c" }}>
        <h1 style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3, marginBottom: 2 }}>
          Learning
        </h1>
        <p style={{ fontSize: 11, color: "#909090", marginBottom: 12 }}>
          University courses, developer tools, and personalized career roadmaps.
        </p>
        <SectionTabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {tab === "Courses"   && <CourseCatalog />}
        {tab === "Dev Tools" && <DevToolsHub />}
        {tab === "My Path"   && <PersonalizedPath />}
      </div>
    </div>
  )
}
