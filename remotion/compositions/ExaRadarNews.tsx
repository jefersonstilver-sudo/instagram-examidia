import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface ExaRadarNewsProps {
  headline: string;
  insight: string;
  source: string;
  hypeScore: number;
}

export const ExaRadarNews: React.FC<ExaRadarNewsProps> = ({
  headline = "Cataratas batem recorde de visitantes",
  insight = "Sua marca esta nos lugares certos?",
  source = "G1 Oeste",
  hypeScore = 85,
}) => {
  const frame = useCurrentFrame();

  const radarPulse = Math.sin(frame * 0.05) * 0.3 + 0.7;
  const textOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const insightOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "#0A0A0A",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
      }}
    >
      {/* Radar label */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#E5202A",
            opacity: radarPulse,
            boxShadow: `0 0 ${radarPulse * 20}px #E5202A`,
          }}
        />
        <span style={{ color: "#E5202A", fontSize: 16, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
          Radar EXA
        </span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, marginLeft: "auto" }}>
          Hype: {hypeScore}/100
        </span>
      </div>

      {/* Headline */}
      <div style={{ opacity: textOpacity }}>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
          {source}
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 40 }}>
          {headline}
        </div>
      </div>

      {/* Insight */}
      <div
        style={{
          opacity: insightOpacity,
          background: "rgba(229, 32, 42, 0.08)",
          border: "1px solid rgba(229, 32, 42, 0.2)",
          borderRadius: 12,
          padding: 30,
        }}
      >
        <div style={{ fontSize: 14, color: "#E5202A", marginBottom: 8, fontWeight: 600 }}>
          INSIGHT EXA
        </div>
        <div style={{ fontSize: 28, color: "white", fontWeight: 600 }}>
          {insight}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
          @examidia
        </span>
      </div>
    </AbsoluteFill>
  );
};
