import { useMemo } from "react"
import { useProgress } from "./useProgress"
import type { Roadmap, RoadmapNode } from "@/types"

interface UseRoadmapReturn {
  roadmap: Roadmap | undefined
  completedNodes: RoadmapNode[]
  lockedNodes: RoadmapNode[]        // nodes whose dependsOn aren't all complete yet
  availableNodes: RoadmapNode[]     // unlocked but not yet complete
  progressPercent: number
  isNodeLocked: (node: RoadmapNode) => boolean
}

export function useRoadmap(goalId: string, roadmaps: Roadmap[]): UseRoadmapReturn {
  const { isComplete } = useProgress()
  const roadmap = roadmaps.find(r => r.id === goalId)

  // A node is locked if any of its prerequisites are not yet complete
  const isNodeLocked = (node: RoadmapNode): boolean =>
    node.dependsOn.some(depId => !isComplete(depId))

  const completedNodes = useMemo(
    () => roadmap?.nodes.filter(n => isComplete(n.id)) ?? [],
    [roadmap, isComplete]
  )

  const lockedNodes = useMemo(
    () => roadmap?.nodes.filter(n => !isComplete(n.id) && isNodeLocked(n)) ?? [],
    [roadmap, isComplete]
  )

  const availableNodes = useMemo(
    () => roadmap?.nodes.filter(n => !isComplete(n.id) && !isNodeLocked(n)) ?? [],
    [roadmap, isComplete]
  )

  const progressPercent = roadmap
    ? Math.round((completedNodes.length / roadmap.nodes.length) * 100)
    : 0

  return { roadmap, completedNodes, lockedNodes, availableNodes, progressPercent, isNodeLocked }
}
