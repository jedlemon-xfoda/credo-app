import fs from "node:fs";

const checks = [
  ["dist-web/index.html", "Built web index exists"],
  ["webapp/src/main.tsx", "React web app entry exists"],
  ["webapp/src/retrieval.ts", "Retrieval engine exists"],
  ["webapp/src/answerComposer.ts", "Local cited answer composer exists"],
  ["webapp/src/ErrorBoundary.tsx", "Runtime error boundary exists"],
  ["webapp/public/manifest.webmanifest", "PWA manifest exists"],
  ["webapp/public/service-worker.js", "Service worker exists"],
  ["PRODUCTION_CHECKLIST.md", "Production checklist exists"],
  ["supabase/schema.sql", "Supabase schema exists"],
  ["imports/catechism-eucharist-sample.json", "Sample source import JSON exists"]
];

let failed = false;

for (const [file, label] of checks) {
  if (!fs.existsSync(file)) {
    console.error(`FAIL: ${label} (${file})`);
    failed = true;
  } else {
    console.log(`PASS: ${label}`);
  }
}

const retrievalSource = fs.readFileSync("webapp/src/retrieval.ts", "utf8");

for (const term of ["eucharist", "confession", "purgatory", "saints"]) {
  if (!retrievalSource.includes(term)) {
    console.error(`FAIL: Retrieval source does not include ${term}`);
    failed = true;
  } else {
    console.log(`PASS: Retrieval source includes ${term}`);
  }
}

if (failed) process.exit(1);

console.log("Smoke test complete.");
