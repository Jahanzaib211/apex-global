/**
 * `@apex/motion` — the shared spatial and interaction layer for the Apex
 * marketing sites.
 *
 * One package rather than four copies, because the point of the exercise is
 * that the four properties feel like one company. Each site supplies its own
 * palette through the CSS custom properties in `./tokens`; nothing here
 * hard-codes a colour, a font or a layout.
 *
 * Every primitive degrades on its own: reduced motion, no WebGL, and lost GPU
 * context each have a defined still state, and the page composition never
 * depends on an effect having succeeded.
 *
 * No runtime dependencies. The spatial field is raw WebGL2 (about 6 KB) rather
 * than Three.js (about 150 KB gzipped) — these are pages whose job is to load
 * fast and rank.
 */

export { SpatialCanvas, type SpatialCanvasProps } from "./spatial-canvas";
export { BrandMark, type BrandMarkProps } from "./brand-mark";
export { LivingBorder, type LivingBorderProps } from "./living-border";
export { GlassPanel, type GlassPanelProps } from "./glass-panel";
export { Tactile, useTactile, type TactileProps, type TactileOptions } from "./tactile";
export {
  usePrefersReducedMotion,
  useMounted,
  usePointerTracker,
  useAnimationFrame,
  useSpring,
  useWebGLSupport,
  useEvent,
  type PointerState,
} from "./hooks";
export {
  MOTION,
  MOTION_VARS,
  SPRING,
  EASE_OUT,
  DEFAULT_PALETTE,
  hexToRgb,
  readPalette,
  type MotionPalette,
} from "./tokens";
