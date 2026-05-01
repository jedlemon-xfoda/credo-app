import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));

if (!args.input || !args.title || !args.sourceType || !args.authorityTier) {
  console.error(`Usage:
node scripts/chunk-source.mjs --input ./sources/file.md --title "Catechism" --source-type catechism --authority-tier 1 --url https://example.com --out ./imports/source.json
`);
  process.exit(1);
}

const inputPath = path.resolve(args.input);
const outPath = path.resolve(args.out || `./imports/${slugify(args.title)}.json`);
const rawText = fs.readFileSync(inputPath, "utf8");
const normalized = normalizeText(rawText);
const sections = splitSections(normalized);
const chunks = sections.flatMap((section) =>
  chunkSection(section, {
    authorityTier: Number(args.authorityTier),
    maxChars: Number(args.maxChars || 1200)
  })
);

const payload = {
  source: {
    title: args.title,
    source_url: args.url || null,
    publisher: args.publisher || null,
    authority_tier: Number(args.authorityTier),
    source_type: args.sourceType,
    status: "draft"
  },
  chunks
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(`Wrote ${chunks.length} chunks to ${outPath}`);

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;

    const key = arg.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[index + 1] : "true";
    parsed[key] = value;
    if (value !== "true") index += 1;
  }

  return parsed;
}

function normalizeText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \u00a0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitSections(text) {
  const blocks = text.split(/\n(?=#{1,3} |\[[^\]]+\]|CCC\s+\d+|Paragraph\s+\d+)/g);

  return blocks.map((block, index) => {
    const lines = block.trim().split("\n");
    const heading = lines[0]?.trim() || `Section ${index + 1}`;
    const body = lines.join("\n").trim();

    return {
      sectionLabel: cleanupHeading(heading),
      text: body
    };
  });
}

function chunkSection(section, { authorityTier, maxChars }) {
  const paragraphs = section.text
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (current && current.length + paragraph.length > maxChars) {
      chunks.push(toChunk(section, current, chunks.length + 1, authorityTier));
      current = paragraph;
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
  }

  if (current) chunks.push(toChunk(section, current, chunks.length + 1, authorityTier));

  return chunks;
}

function toChunk(section, text, index, authorityTier) {
  const paragraphNumber = extractParagraphNumber(section.sectionLabel) || extractParagraphNumber(text);
  const suffix = index > 1 ? `.${index}` : "";
  const citationLabel = paragraphNumber
    ? `CCC ${paragraphNumber}${suffix}`
    : `${section.sectionLabel}${suffix}`;

  return {
    citation_label: citationLabel,
    section_label: section.sectionLabel,
    paragraph_number: paragraphNumber,
    authority_tier: authorityTier,
    token_count: estimateTokens(text),
    chunk_text: stripMarkdownHeading(text)
  };
}

function cleanupHeading(heading) {
  return heading.replace(/^#{1,3}\s*/, "").replace(/^\[|\]$/g, "").trim();
}

function stripMarkdownHeading(text) {
  return text.replace(/^#{1,3}\s+.*\n+/, "").trim();
}

function extractParagraphNumber(text) {
  const match = text.match(/\b(?:CCC|Paragraph)?\s*(\d{3,4})\b/i);
  return match?.[1] || null;
}

function estimateTokens(text) {
  return Math.ceil(text.split(/\s+/).filter(Boolean).length * 1.35);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
