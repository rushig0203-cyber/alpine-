/**
 * Time-of-day presets for the Alpine Astonia digital twin.
 *
 * Every value here is interpolated (never snapped) so switching the hour of the
 * day reads as a smooth cinematic transition rather than a state change.
 */

export type TimeKey = "dawn" | "day" | "dusk" | "night";

export type TimePreset = {
  label: string;
  /** Sun / key light position in world units. */
  sun: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  ambient: string;
  ambientIntensity: number;
  /** Vertical sky gradient. */
  skyTop: string;
  skyHorizon: string;
  /** Ground bounce colour used by the hemisphere light. */
  bounce: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  /** How strongly interior/retail lighting glows. */
  windows: number;
  bloom: number;
  envIntensity: number;
};

export const TIME_ORDER: TimeKey[] = ["dawn", "day", "dusk", "night"];

export const TIME_PRESETS: Record<TimeKey, TimePreset> = {
  dawn: {
    label: "Dawn",
    sun: [-78, 26, 54],
    sunColor: "#ffcda1",
    sunIntensity: 2.6,
    ambient: "#b9cbe0",
    ambientIntensity: 0.75,
    skyTop: "#5d7fae",
    skyHorizon: "#f4cfae",
    bounce: "#7c8496",
    fog: "#dcd0c6",
    fogNear: 90,
    fogFar: 330,
    windows: 0.5,
    bloom: 0.5,
    envIntensity: 0.9,
  },
  day: {
    label: "Day",
    sun: [62, 86, 48],
    sunColor: "#fff5e6",
    sunIntensity: 3.4,
    ambient: "#cfe0f2",
    ambientIntensity: 0.95,
    skyTop: "#3f78bb",
    skyHorizon: "#d6e7f5",
    bounce: "#9aa0a4",
    fog: "#dbe7f2",
    fogNear: 120,
    fogFar: 380,
    windows: 0.08,
    bloom: 0.28,
    envIntensity: 1.15,
  },
  dusk: {
    label: "Dusk",
    sun: [-84, 15, -26],
    sunColor: "#ff9a58",
    sunIntensity: 3,
    ambient: "#4d6488",
    ambientIntensity: 0.55,
    skyTop: "#1b2745",
    skyHorizon: "#f08a4b",
    bounce: "#3c4457",
    fog: "#4a4557",
    fogNear: 80,
    fogFar: 300,
    windows: 1,
    bloom: 0.72,
    envIntensity: 0.7,
  },
  night: {
    label: "Night",
    sun: [-46, 62, -58],
    sunColor: "#a8c0ff",
    sunIntensity: 0.75,
    ambient: "#22334f",
    ambientIntensity: 0.4,
    skyTop: "#04070f",
    skyHorizon: "#122036",
    bounce: "#151d2b",
    fog: "#0b111c",
    fogNear: 70,
    fogFar: 280,
    windows: 1.25,
    bloom: 0.95,
    envIntensity: 0.5,
  },
};
