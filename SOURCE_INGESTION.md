# Source Ingestion Draft

The chatbot should eventually answer from reviewed Catholic source chunks, not from generic memory.

This draft adds:

- `scripts/chunk-source.mjs`
- `sources/samples/catechism-eucharist-sample.md`
- `imports/*.json` output when the script runs

## Run Example

```bash
node scripts/chunk-source.mjs --input sources/samples/catechism-eucharist-sample.md --title "Catechism Eucharist Sample" --source-type catechism --authority-tier 1 --publisher Vatican --url https://www.vatican.va/archive/ENG0015/_P3W.HTM --out imports/catechism-eucharist-sample.json
```

## Output Shape

```json
{
  "source": {
    "title": "Catechism Eucharist Sample",
    "source_url": "https://www.vatican.va/archive/ENG0015/_P3W.HTM",
    "publisher": "Vatican",
    "authority_tier": 1,
    "source_type": "catechism",
    "status": "draft"
  },
  "chunks": [
    {
      "citation_label": "CCC 1324",
      "section_label": "CCC 1324",
      "paragraph_number": "1324",
      "authority_tier": 1,
      "token_count": 44,
      "chunk_text": "..."
    }
  ]
}
```

## Next Retrieval Step

1. Convert source JSON to SQL:

```bash
node scripts/import-source-json.mjs imports/catechism-eucharist-sample.json > imports/catechism-eucharist-sample.sql
```

2. Import the generated SQL into Supabase.
3. Generate embeddings for each `chunk_text`.
4. Store embeddings in `source_chunks.embedding`.
5. Add a retrieval endpoint:
   - embed user question
   - search nearest chunks
   - re-rank by authority tier
   - generate answer from retrieved chunks only
   - return citations and source drawer data

## Later Retrieval Step

After source chunks are imported:

1. Add an embedding script.
2. Generate embeddings for each `chunk_text`.
3. Store embeddings in `source_chunks.embedding`.
4. Add a retrieval endpoint:
   - embed user question
   - search nearest chunks
   - re-rank by authority tier
   - generate answer from retrieved chunks only
   - return citations and source drawer data
