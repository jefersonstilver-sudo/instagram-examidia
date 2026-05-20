/**
 * Remotion Compositions Registry
 *
 * To use Remotion for rendering:
 * 1. npm install remotion @remotion/cli @remotion/bundler
 * 2. Create a remotion/Root.tsx with registerRoot
 * 3. Run: npx remotion studio
 *
 * These compositions are ready to be registered.
 */

export { ExaDataPulse } from "./compositions/ExaDataPulse";
export { ExaRadarNews } from "./compositions/ExaRadarNews";
export { ExaCommercialCTA } from "./compositions/ExaCommercialCTA";

export const COMPOSITIONS = [
  {
    id: "ExaDataPulse",
    component: "ExaDataPulse",
    durationInFrames: 150,
    fps: 30,
    width: 1080,
    height: 1920,
    description: "Video com dados animados da EXA (predios, alcance, slots, crescimento)",
  },
  {
    id: "ExaRadarNews",
    component: "ExaRadarNews",
    durationInFrames: 120,
    fps: 30,
    width: 1080,
    height: 1920,
    description: "Video curto transformando noticia do radar em insight visual",
  },
  {
    id: "ExaCommercialCTA",
    component: "ExaCommercialCTA",
    durationInFrames: 120,
    fps: 30,
    width: 1080,
    height: 1920,
    description: "Video comercial com CTA para WhatsApp da Jeni",
  },
] as const;
