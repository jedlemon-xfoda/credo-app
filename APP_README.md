# The Ordinary Catholic App Skeleton

This folder now contains two related artifacts:

- `index.html` - static clickable prototype.
- `App.tsx` - Expo / React Native app skeleton.

## What Is Built

- Five V1 tabs:
  - Today
  - Ask
  - Library
  - Pray
  - Community
- Local Catholic mock data in `src/data/content.ts`.
- Brand theme in `src/theme.ts`.
- A working local Ask loop:
  - Type a question.
  - Search local trusted topics.
  - Show a cited answer.
  - Show authority-tiered citations.
  - Save the topic in local screen state.

## How To Run Later

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Then choose iOS, Android, or web from the Expo terminal UI.

## Next Engineering Step

Connect this skeleton to a backend:

1. Create Supabase project.
2. Add `sources` and `source_chunks` tables.
3. Import a small reviewed source set.
4. Add retrieval endpoint.
5. Replace local `findAnswer()` with real source retrieval.
