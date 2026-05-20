import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface ExaDataPulseProps {
  predios: number;
  alcanceDiario: number;
  slots: number;
  crescimento: string;
}

export const ExaDataPulse: React.FC<ExaDataPulseProps> = ({
  predios = 20,
  alcanceDiario = 245,
  slots = 5,
  crescimento = "+18%",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [30, 0], { extrapolateRight: "clamp" });

  const dataEntries = [
    { label: "Predios na rede", value: `+${predios}`, delay: 30 },
    { label: "Exibicoes/dia", value: `${alcanceDiario}`, delay: 45 },
    { label: "Slots disponiveis", value: `${slots}`, delay: 60 },
    { label: "Crescimento", value: crescimento, delay: 75 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0A0A0A 0%, #1a0a0a 50%, #0A0A0A 100%)",
        fontFamily: "system-ui, sans-serif",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* EXA Logo */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 60,
        }}
      >
        <div style={{ fontSize: 24, color: "#E5202A", fontWeight: 700, letterSpacing: 4 }}>
          EXA MIDIA
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, color: "white", marginTop: 10 }}>
          Seus numeros.
          <br />
          <span style={{ color: "#E5202A" }}>Nossa entrega.</span>
        </div>
      </div>

      {/* Data grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        {dataEntries.map((entry) => {
          const scale = spring({ frame: frame - entry.delay, fps, config: { damping: 12 } });
          const opacity = interpolate(frame, [entry.delay, entry.delay + 15], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div
              key={entry.label}
              style={{
                opacity,
                transform: `scale(${scale})`,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 30,
              }}
            >
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                {entry.label}
              </div>
              <div style={{ fontSize: 48, fontWeight: 900, color: "white", fontFamily: "monospace" }}>
                {entry.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {frame > 100 && (
        <div
          style={{
            marginTop: 50,
            opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateRight: "clamp" }),
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "#E5202A",
              color: "white",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Anuncie na EXA
          </div>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Fale com a Jeni: (45) 99832-3225
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
