import { useState } from "react"
import SectionTabs from "@/components/shared/SectionTabs"
import GitHubGuide from "./GitHubGuide"
import DevDocsExplorer from "./DevDocsExplorer"

const TABS = ["GitHub", "Dev Docs & Research"]

export default function DevToolsHub() {
  const [tab, setTab] = useState("GitHub")

  return (
    <div style={{ padding: 16 }}>
      <SectionTabs tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ paddingTop: 20 }}>
        {tab === "GitHub"              && <GitHubGuide />}
        {tab === "Dev Docs & Research" && <DevDocsExplorer />}
      </div>
    </div>
  )
}
