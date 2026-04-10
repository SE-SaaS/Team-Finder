interface ProgressBarProps {
  percent: number           // 0–100
  label?: string            // e.g. "7 / 12 nodes complete"
  color?: string            // defaults to accent green
  height?: number           // px, default 6
}

export default function ProgressBar({
  percent,
  label,
  color = "#3ef07a",
  height = 6,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 10, color: "#909090", marginBottom: 4,
        }}>
          <span>{label}</span>
          <span style={{ color }}>{clamped}%</span>
        </div>
      )}
      <div style={{
        width: "100%", height, borderRadius: height,
        background: "#252525", overflow: "hidden",
      }}>
        <div style={{
          width: `${clamped}%`, height: "100%",
          background: color, borderRadius: height,
          transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  )
}
