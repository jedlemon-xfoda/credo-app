export const ATTEND_ICON_COLOR = "#B8945A";

export const attendIconNames = [
  "stand",
  "sit",
  "kneel",
  "process",
  "cross",
  "home",
  "more",
  "left-chevron",
  "chalice",
  "lyre-music",
  "gloria-sunburst",
  "sacred-divider-ornament"
] as const;

export type AttendIconName = (typeof attendIconNames)[number];

export type AttendIconDefinition = {
  name: AttendIconName;
  fileName: `${AttendIconName}.svg`;
  viewBox: string;
  role: "functional" | "posture" | "ornamental";
};

export const attendIcons: Record<AttendIconName, AttendIconDefinition> = {
  stand: { name: "stand", fileName: "stand.svg", viewBox: "0 0 24 24", role: "posture" },
  sit: { name: "sit", fileName: "sit.svg", viewBox: "0 0 24 24", role: "posture" },
  kneel: { name: "kneel", fileName: "kneel.svg", viewBox: "0 0 24 24", role: "posture" },
  process: { name: "process", fileName: "process.svg", viewBox: "0 0 24 24", role: "posture" },
  cross: { name: "cross", fileName: "cross.svg", viewBox: "0 0 24 24", role: "functional" },
  home: { name: "home", fileName: "home.svg", viewBox: "0 0 24 24", role: "functional" },
  more: { name: "more", fileName: "more.svg", viewBox: "0 0 24 24", role: "functional" },
  "left-chevron": { name: "left-chevron", fileName: "left-chevron.svg", viewBox: "0 0 24 24", role: "functional" },
  chalice: { name: "chalice", fileName: "chalice.svg", viewBox: "0 0 24 24", role: "ornamental" },
  "lyre-music": { name: "lyre-music", fileName: "lyre-music.svg", viewBox: "0 0 24 24", role: "ornamental" },
  "gloria-sunburst": { name: "gloria-sunburst", fileName: "gloria-sunburst.svg", viewBox: "0 0 24 24", role: "ornamental" },
  "sacred-divider-ornament": {
    name: "sacred-divider-ornament",
    fileName: "sacred-divider-ornament.svg",
    viewBox: "0 0 96 24",
    role: "ornamental"
  }
};
