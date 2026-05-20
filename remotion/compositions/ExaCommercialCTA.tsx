import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface ExaCommercialCTAProps {
  headline: string;
  subheadline: string;
  cta: string;
  whatsapp: string;
}

export const ExaCommercialCTA: React.FC<ExaCommercialCTAProps> = ({
  headline = "Sua marca vista 245x por dia",
  subheadline = "Em elevadores dos melhores predios de Foz",
  cta = "Fale com a Jeni",
  whatsapp = "(45) 99832-3225",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const subOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const ctaScale = spring({ frame: frame - 60, fps, config: { damping: 15 } });
  const pulse = Math.sin(frame * 0.08) * 0.05 + 1;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #1a0505 100%)",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 60,
      }}
    >
      {/* EXA brand */}
      <div style={{ fontSize: 20, color: "#E5202A", fontWeight: 700, letterSpacing: 6, marginBottom: 60 }}>
        EXA MIDIA
      </div>

      {/* Headline */}
      <div style={{ transform: `scale(${titleScale})`, marginBottom: 20 }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: "white", lineHeight: 1.1 }}>
          {headline}
        </div>
      </div>

      {/* Sub */}
      <div style={{ opacity: subOpacity, fontSize: 22, color: "rgba(255,255,255,0.6)", marginBottom: 60, maxWidth: 500 }}>
        {subheadline}
      </div>

      {/* CTA Button */}
      {frame > 60 && (
        <div style={{ transform: `scale(${ctaScale * pulse})` }}>
          <div
            style={{
              background: "#E5202A",
              color: "white",
              padding: "20px 48px",
              borderRadius: 12,
              fontSize: 24,
              fontWeight: 800,
              boxShadow: "0 0 40px rgba(229, 32, 42, 0.4)",
            }}
          >
            {cta}
          </div>
          <div style={{ marginTop: 16, color: "rgba(255,255,255,0.5)", fontSize: 16 }}>
            WhatsApp: {whatsapp}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
