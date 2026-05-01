import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "webapp/src/content.ts",
  "webapp/src/main.tsx",
  "webapp/src/styles.css",
  "webapp/public/manifest.webmanifest",
  "webapp/public/service-worker.js",
  "PRODUCTION_CHECKLIST.md"
];

const read = (path) => readFileSync(join(root, path), "utf8");
const content = Object.fromEntries(files.map((file) => [file, read(file)]));
const source = content["webapp/src/content.ts"];
const app = content["webapp/src/main.tsx"];
const allText = Object.values(content).join("\n");

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const countMatches = (text, pattern) => [...text.matchAll(pattern)].length;

assert(countMatches(source, /key: "/g) >= 15, "Expected at least 15 answer records.");
assert(countMatches(source, /title: "/g) >= 55, "Expected a substantial topic and prayer catalog.");
assert(countMatches(source, /text: "/g) >= 24, "Expected most prayers to include reviewed prayer text.");
assert(source.includes("St. Michael Prayer"), "Missing St. Michael Prayer.");
assert(source.includes("Divine Mercy Chaplet"), "Missing Divine Mercy Chaplet.");
assert(source.includes("Prayer Before Meals"), "Missing Prayer Before Meals.");
assert(app.includes("prayedPrayers"), "Prayer completion state is not wired into the app.");
assert(app.includes("prayerReminders"), "Prayer reminder state is not wired into the app.");
assert(app.includes("quick-dock"), "Today quick-action dock is missing.");
assert(app.includes("challengeProgress"), "Daily challenge progress is not wired into the app.");
assert(app.includes("Copy share card"), "Share-ready answer action is missing.");
assert(app.includes("segmented-controls"), "Prayer session controls are missing.");
assert(app.includes("PrayerTimer"), "Prayer timer is missing.");
assert(app.includes("rosaryMysteries"), "Interactive Rosary mysteries are missing.");
assert(app.includes("rosary-progress-grid"), "Rosary progress grid is missing.");
assert(app.includes("dailyReadings"), "Daily readings card is missing.");
assert(app.includes("John 10:22-30"), "Daily Gospel citation is missing.");
assert(app.includes("EmptyState"), "Search empty states are missing.");
assert(app.includes("result-count"), "Search result counts are missing.");
assert(app.includes("Release Candidate"), "Sidebar should use release language, not prototype language.");
assert(!app.includes("prototype"), "App runtime copy still references prototype.");
assert(!app.includes("future Supabase"), "App runtime copy still references future backend language.");
assert(app.includes("SourceDetail"), "Source drawer must remain available for cited answers.");
assert(!allText.includes("This screen will hold"), "Prototype placeholder copy is still present.");
assert(!allText.includes("TODO"), "TODO placeholder text is still present.");
assert(!/[�â€œâ€]/.test(allText), "Detected likely mojibake/corrupt typography.");
assert(content["webapp/public/manifest.webmanifest"].includes("The Ordinary Catholic"), "Manifest brand name is missing.");
assert(content["webapp/public/service-worker.js"].includes("ordinary-catholic"), "Service worker cache name is missing.");

if (failures.length) {
  console.error("Content integrity failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Content integrity passed.");
