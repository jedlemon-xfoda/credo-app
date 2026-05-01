export const brand = {
  appName: "CREDO",
  tagline: "Understand the Mass. Live the Faith.",
  categoryLine: "The quiet companion for Sunday Mass.",
  rhythm: ["Prepare", "Attend", "Reflect"] as const,
  makerLine: "A Sunday companion from Ordinary Catholic"
};

export type RhythmStep = (typeof brand.rhythm)[number];
