# Backend Setup Notes

This folder now includes a starter Supabase backend plan:

- `supabase/schema.sql`
- `supabase/seed.sql`

## What It Supports

- User profiles and preferences.
- Trusted Catholic sources.
- Source chunks for future retrieval/citation.
- Topics and topic-source relationships.
- Saved cited answers.
- Prayers and novenas.
- Prayer intentions.
- "I prayed" tracking.
- Reports and moderation queue foundation.

## Setup Path

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql`.
5. Add environment variables to the web app:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

6. Replace localStorage calls in the React app with Supabase queries.

## Important Note

The schema enables pgvector and declares `source_chunks.embedding` as `vector(1536)`, which matches a common embedding dimension. If you choose a different embedding model later, update that dimension before importing chunks.

## Recommended Next Code Step

Add a Supabase client and keep localStorage as fallback:

- If Supabase env vars exist, read/write saved answers and intentions from Supabase.
- If not, continue using localStorage.

That lets development continue locally while preparing for real accounts.
