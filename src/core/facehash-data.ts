import { stringHash } from "../utils/hash.ts";

export type Variant = "gradient" | "solid";

export type FaceType = "round" | "cross" | "line" | "curved";

export type FacehashBlinkTiming = {
  delay: number;
  duration: number;
};

export type FacehashBlinkTimings = {
  left: FacehashBlinkTiming;
  right: FacehashBlinkTiming;
};

export const FACE_TYPES: readonly FaceType[] = ["round", "cross", "line", "curved"] as const;

export type FacehashData = {
  faceType: FaceType;
  colorIndex: number;
  rotation: { x: number; y: number };
  initial: string;
  blinkTimings: FacehashBlinkTimings;
};

export type ComputeFacehashOptions = {
  name: string;
  colorsLength?: number;
};

const SPHERE_POSITIONS = [
  { x: -1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
] as const;

export const DEFAULT_COLORS = ["#ec4899", "#f59e0b", "#3b82f6", "#f97316", "#10b981"] as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 1) {
    return name.charAt(0).toUpperCase();
  }

  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.at(-1)?.charAt(0) ?? "";
  return (first + last).toUpperCase();
}

export function computeFacehash(options: ComputeFacehashOptions): FacehashData {
  const { name, colorsLength = DEFAULT_COLORS.length } = options;

  const hash = stringHash(name);
  const faceIndex = hash % FACE_TYPES.length;
  const colorIndex = hash % colorsLength;
  const positionIndex = hash % SPHERE_POSITIONS.length;
  const position = SPHERE_POSITIONS[positionIndex] ?? { x: 0, y: 0 };
  const blinkSeed = hash * 31;
  const blinkTiming = {
    delay: (blinkSeed % 40) / 10,
    duration: 2 + (blinkSeed % 40) / 10,
  };

  return {
    faceType: FACE_TYPES[faceIndex] ?? "round",
    colorIndex,
    rotation: position,
    initial: getInitials(name),
    blinkTimings: {
      left: { ...blinkTiming },
      right: { ...blinkTiming },
    },
  };
}

const FALLBACK_COLOR = "#ec4899";

export function getColor(colors: readonly string[] | undefined, index: number): string {
  const palette = colors && colors.length > 0 ? colors : DEFAULT_COLORS;
  return palette[index % palette.length] ?? FALLBACK_COLOR;
}
