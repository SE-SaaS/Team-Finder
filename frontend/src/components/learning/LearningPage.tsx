import SectionTabs from "@/components/shared/SectionTabs"
import CourseCatalog from "./courses/CourseCatalog"
import DevToolsHub from "./devtools/DevToolsHub"
import PersonalizedPath from "./path/PersonalizedPath"
import { useState, useEffect, useMemo } from "react"
import { useCourses } from "@/hooks/useCourses"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import BackgroundCanvas from "@/components/dashboard/background/BackgroundCanvas"

export default function LearningPage() {
  const [tab, setTab] = useState("Courses")
  const [defaultUni, setDefaultUni]       = useState<string | undefined>(undefined)
  const [defaultYear, setDefaultYear]     = useState<number | undefined>(undefined)
  const [profileReady, setProfileReady]   = useState(false)

  const { courses, loading } = useCourses()

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from("profiles")
          .select("university, year")
          .eq("id", user.id)
          .single()
        if (data) {
          if (data.university === "University of Jordan") setDefaultUni("JU")
          else if (data.university === "Hashemite University") setDefaultUni("HU")
          if (data.year) setDefaultYear(data.year)
        }
      } finally {
        setProfileReady(true)
      }
    }
    loadProfile()
  }, [])

  const TABS = useMemo(() => [
    { label: "Courses",   count: courses.length },
    { label: "Dev Tools", count: 10 },
    { label: "My Path" },
  ], [courses.length])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%",
      background: "transparent", color: "#e8e8e8", fontFamily: "system-ui, sans-serif" }}>
      <BackgroundCanvas />

      <div style={{ padding: "14px 18px 0", background: "transparent" }}>
        <Link
          href="/dashboard"
          style={{ display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, color: "#909090", textDecoration: "none", marginBottom: 10 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#e8e8e8")}
          onMouseLeave={e => (e.currentTarget.style.color = "#909090")}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <h1 style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3, marginBottom: 2 }}>Learning</h1>
        <p style={{ fontSize: 11, color: "#909090", marginBottom: 12 }}>
          University courses, developer tools, and personalized career roadmaps.
        </p>
        <SectionTabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        {tab === "Courses" && profileReady && (
          <CourseCatalog
            courses={courses}
            loading={loading}
            defaultUniversity={defaultUni}
            defaultYear={defaultYear}
          />
        )}
        {tab === "Dev Tools" && <DevToolsHub />}
        {tab === "My Path"   && <PersonalizedPath />}
      </div>
    </div>
  )
}
