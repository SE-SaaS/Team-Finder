import { useState, useCallback, useMemo } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { RoadmapNodeComponent } from "./RoadmapNode"
import NodeDetailPanel from "./NodeDetailPanel"
import { useProgress } from "@/hooks/useProgress"
import { useRoadmap } from "@/hooks/useRoadmap"
import type { Roadmap, RoadmapNode } from "@/types"

const NODE_TYPES = { roadmapNode: RoadmapNodeComponent }

interface RoadmapViewerProps {
  roadmap: Roadmap
}

export default function RoadmapViewer({ roadmap }: RoadmapViewerProps) {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
  const { isComplete } = useProgress()
  const { isNodeLocked } = useRoadmap(roadmap.id)

  // Transform roadmap nodes → ReactFlow nodes
  const rfNodes: Node[] = useMemo(() =>
    roadmap.nodes.map(node => ({
      id: node.id,
      type: "roadmapNode",
      position: { x: node.x, y: node.y },
      data: {
        node,
        locked: isNodeLocked(node),
        selected: selectedNode?.id === node.id,
        onSelect: setSelectedNode,
      },
    })),
    [roadmap.nodes, selectedNode, isNodeLocked]
  )

  // Transform roadmap edges → ReactFlow edges
  const rfEdges: Edge[] = useMemo(() =>
    roadmap.edges.map(edge => ({
      id: `${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      style: {
        stroke: isComplete(edge.from) ? "#3ef07a55" : "#2a2a2a",
        strokeWidth: 1.5,
      },
      animated: isComplete(edge.from) && !isComplete(edge.to),
    })),
    [roadmap.edges, isComplete]
  )

  const onNodeClick = useCallback(() => {}, []) // handled inside custom node

  return (
    <div style={{ display: "flex", height: "100%", background: "#0c0c0c" }}>

      {/* ReactFlow Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={NODE_TYPES}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          style={{ background: "#0c0c0c" }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            color="#2a2a2a"
            gap={20}
            size={1}
          />
          <Controls
            style={{ background: "#161616", border: "1px solid #2a2a2a" }}
          />
          <MiniMap
            style={{ background: "#161616", border: "1px solid #2a2a2a" }}
            nodeColor={n => {
              const node = roadmap.nodes.find(rn => rn.id === n.id)
              if (!node) return "#252525"
              if (isComplete(node.id)) return "#3ef07a"
              if (isNodeLocked(node)) return "#252525"
              return "#363636"
            }}
          />
        </ReactFlow>
      </div>

      {/* Side Panel */}
      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}
