import fs from "node:fs";
import path from "node:path";

const input = process.argv[2];

if (!input) {
  console.error("Usage: node scripts/import-source-json.mjs ./imports/source.json > imports/source.sql");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(path.resolve(input), "utf8"));
const source = payload.source;
const chunks = payload.chunks || [];

console.log("begin;");
console.log("");
console.log("with inserted_source as (");
console.log("  insert into public.sources (title, source_url, publisher, authority_tier, source_type, status)");
console.log(
  `  values (${sql(source.title)}, ${sql(source.source_url)}, ${sql(source.publisher)}, ${Number(
    source.authority_tier
  )}, ${sql(source.source_type)}, ${sql(source.status || "draft")})`
);
console.log("  returning id");
console.log(")");
console.log("insert into public.source_chunks (source_id, chunk_text, citation_label, section_label, paragraph_number, authority_tier, token_count)");
console.log("select inserted_source.id, chunk_text, citation_label, section_label, paragraph_number, authority_tier, token_count");
console.log("from inserted_source, (values");
console.log(
  chunks
    .map((chunk, index) => {
      const suffix = index === chunks.length - 1 ? "" : ",";
      return `  (${sql(chunk.chunk_text)}, ${sql(chunk.citation_label)}, ${sql(
        chunk.section_label
      )}, ${sql(chunk.paragraph_number)}, ${Number(chunk.authority_tier)}, ${Number(chunk.token_count)})${suffix}`;
    })
    .join("\n")
);
console.log(") as chunks(chunk_text, citation_label, section_label, paragraph_number, authority_tier, token_count);");
console.log("");
console.log("commit;");

function sql(value) {
  if (value === null || value === undefined || value === "") return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}
