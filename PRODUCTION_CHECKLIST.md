# Production Checklist

## Current State

The Ordinary Catholic is now a working browser prototype with:

- React/Vite web app.
- Static prototype backup.
- Local cited Ask flow.
- Local source retrieval.
- Local answer composer.
- LocalStorage persistence.
- Supabase-ready service layer.
- Supabase schema and seed files.
- Source ingestion scripts.
- PWA manifest and service worker.
- Runtime error boundary.
- Smoke test.

## Required Before Public Launch

### Doctrine And Source Review

- Review all source tiers with a priest, deacon, theologian, or qualified catechist.
- Review first Ask answer set.
- Review sensitive-topic caution language.
- Confirm source usage and licensing.
- Decide whether static doctrine/prayer pages need formal review.

### Backend

- Create Supabase project.
- Run `supabase/schema.sql`.
- Run `supabase/seed.sql`.
- Configure auth redirect URLs.
- Add `VITE_SUPABASE_URL`.
- Add `VITE_SUPABASE_ANON_KEY`.
- Test sign-in, saved answers, and prayer intentions with real accounts.

### Retrieval

- Import reviewed source chunks.
- Generate embeddings.
- Add vector search endpoint.
- Replace local retrieval with Supabase retrieval.
- Add answer generation endpoint.
- Add logging for weak/uncited answers.

### Security And Privacy

- Confirm row-level security policies.
- Add moderation dashboard.
- Add content reporting workflow.
- Add privacy policy.
- Add terms of use.
- Add pastoral disclaimer.
- Avoid collecting confession-like personal details.

### Product

- Add real prayer text review.
- Add novena day flows.
- Add notification/reminder strategy.
- Add onboarding analytics.
- Add saved library screen.
- Add empty/loading/error states for backend calls.

### Release

- Deploy web app to Vercel, Netlify, or Supabase Hosting.
- Configure custom domain.
- Add monitoring.
- Run Lighthouse audit.
- Run accessibility pass.
- Test mobile layouts.
- Prepare app-store path separately if using Expo native.

## Commands

```bash
npm run typecheck
npm run build:webapp
npm run smoke
```

## Local Preview

The current served build is available at:

```text
http://localhost:5173/
```

