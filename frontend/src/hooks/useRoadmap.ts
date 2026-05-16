import { useMemo, useCallback } from "react"
import { useProgress } from "./useProgress"
import type { Roadmap, RoadmapNode } from "@/types"

interface UseRoadmapReturn {
  roadmap: Roadmap | undefined
  completedNodes: RoadmapNode[]
  lockedNodes: RoadmapNode[]
  availableNodes: RoadmapNode[]
  progressPercent: number
  isNodeLocked: (node: RoadmapNode) => boolean
}

export function useRoadmap(goalId: string, roadmaps: Roadmap[]): UseRoadmapReturn {
  const { isComplete } = useProgress()
  const roadmap = roadmaps.find(r => r.id === goalId)

  const isNodeLocked = useCallback(
    (node: RoadmapNode): boolean => node.dependsOn.some(depId => !isComplete(depId)),
    [isComplete]
  )

  const completedNodes = useMemo(
    () => roadmap?.nodes.filter(n => isComplete(n.id)) ?? [],
    [roadmap, isComplete]
  )

  const lockedNodes = useMemo(
    () => roadmap?.nodes.filter(n => !isComplete(n.id) && isNodeLocked(n)) ?? [],
    [roadmap, isComplete, isNodeLocked]
  )

  const availableNodes = useMemo(
    () => roadmap?.nodes.filter(n => !isComplete(n.id) && !isNodeLocked(n)) ?? [],
    [roadmap, isComplete, isNodeLocked]
  )

  const progressPercent = roadmap
    ? Math.round((completedNodes.length / roadmap.nodes.length) * 100)
    : 0

  return { roadmap, completedNodes, lockedNodes, availableNodes, progressPercent, isNodeLocked }
}
