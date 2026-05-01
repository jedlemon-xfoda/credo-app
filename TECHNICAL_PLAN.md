# The Ordinary Catholic Technical Plan

## Goal

Build a Catholic reference, prayer, and community app where the core differentiator is a citation-first chatbot grounded in trusted Catholic sources.

The first technical milestone should prove this loop:

> Ask a question -> retrieve trusted Catholic source snippets -> generate a cited answer -> open source drawer -> save topic.

## Recommended Stack

### App

- Expo / React Native.
- TypeScript.
- React Navigation for tabs and stacked detail screens.
- Local state with React Query or TanStack Query.
- Secure storage for auth tokens and user preferences.

### Backend

- Supabase Auth for accounts.
- Supabase Postgres for relational data.
- Supabase Storage for source files if needed.
- Postgres `pgvector` for source embeddings, or a managed vector database if scale requires it.
- Edge Functions or a small Node API for retrieval and answer generation.

### AI

- OpenAI API for answer generation.
- Embeddings for source chunks.
- Retrieval-augmented generation only. The model should not answer Catholic doctrine questions without retrieved sources.

## App Navigation

V1 tabs:

- Today
- Ask
- Library
- Pray
- Community

Important detail screens:

- Answer detail / source drawer.
- Topic detail.
- Prayer flow.
- Novena day.
- Prayer intention detail.
- Saved topics.
- Settings and source policy.

## Database Schema Draft

### users

Supabase-managed auth users.

### profiles

- id
- user_id
- display_name
- parish_name
- role
- created_at

Roles:

- user
- moderator
- advisor
- clergy_verified
- admin

### sources

- id
- title
- source_url
- publisher
- authority_tier
- source_type
- status
- imported_at
- reviewed_by

Example source types:

- scripture
- catechism
- vatican_document
- council_document
- papal_document
- church_father
- saint
- aquinas
- new_advent
- prayer

### source_chunks

- id
- source_id
- chunk_text
- citation_label
- section_label
- paragraph_number
- authority_tier
- embedding
- token_count
- created_at

### topics

- id
- title
- slug
- summary
- primary_source_ids
- related_topic_ids
- status

### questions

- id
- topic_id
- question
- answer_summary
- reviewed_status
- created_at

### saved_answers

- id
- user_id
- question_text
- answer_text
- citations_json
- created_at

### prayers

- id
- title
- category
- text_english
- text_latin
- source_note
- audio_url

### novenas

- id
- title
- description
- days_json
- category

### prayer_intentions

- id
- user_id
- body
- visibility
- group_id
- status
- created_at

Statuses:

- pending
- approved
- rejected
- hidden

### intention_prayers

- id
- intention_id
- user_id
- created_at

### reports

- id
- reporter_id
- target_type
- target_id
- reason
- status
- created_at

## Source Authority Tiers

Tier 1:

- Sacred Scripture.
- Catechism of the Catholic Church.
- Vatican documents.
- Ecumenical councils.
- Papal encyclicals and apostolic documents.

Tier 2:

- Church Fathers.
- Doctors of the Church.
- St. Thomas Aquinas.
- Writings of canonized saints.

Tier 3:

- New Advent Catholic Encyclopedia.
- Historical Catholic reference works.
- Reviewed explanatory material.

Tier 4:

- User reflections.
- Prayer intentions.
- Community discussion.

Tier 4 content must never be used as doctrinal authority.

## Source Ingestion Flow

1. Add a source record.
2. Fetch or manually upload source text.
3. Normalize text.
4. Split into chunks with stable citation labels.
5. Store original source metadata.
6. Generate embeddings for chunks.
7. Mark source as unreviewed.
8. Advisor or admin reviews source metadata and chunk quality.
9. Mark source as active.

Chunking rules:

- Preserve paragraph numbers where possible.
- Keep chunks small enough for precise citations.
- Avoid splitting a sentence across chunks.
- Store document title, section, paragraph, and URL.
- Never strip the citation context needed to verify the answer.

## Ask Retrieval Flow

1. User submits question.
2. Classify intent:
   - doctrine
   - prayer
   - history
   - moral/pastoral
   - community/support
   - unsafe or out of scope
3. Detect sensitive areas:
   - confession or grave sin
   - spiritual direction
   - scrupulosity
   - mental health
   - marriage/annulment
   - medical/legal advice
4. Search source chunks by semantic similarity.
5. Re-rank by authority tier and topic match.
6. Select a small set of sources.
7. Generate answer only from retrieved sources.
8. Return:
   - answer
   - source chips
   - source drawer content
   - source tier labels
   - pastoral caution if needed
9. Save answer if user taps save.

## Citation Format

Every answer should include:

- Source title.
- Source type.
- Authority tier.
- Section or paragraph label.
- Direct URL when available.
- Short explanation of why the source supports the answer.

Example:

```json
{
  "label": "CCC 1422-1498",
  "source_type": "catechism",
  "authority_tier": 1,
  "url": "https://www.vatican.va/archive/ENG0015/_INDEX.HTM",
  "supports": "Defines the sacrament of Penance and Reconciliation."
}
```

## Answer Generation Rules

System behavior:

- Answer as a Catholic reference assistant.
- Use only retrieved trusted sources for doctrinal claims.
- Do not invent citations.
- Do not quote long copyrighted passages.
- Distinguish official teaching from theology, history, and commentary.
- Say when a topic involves prudential judgment or pastoral direction.
- Encourage users to speak with a priest for confession, spiritual direction, personal grave sin, annulment, or serious moral crisis.
- Do not present community content as doctrine.

Answer structure:

1. Short direct answer.
2. Explanation.
3. Source chips.
4. Source drawer.
5. Pastoral caution if needed.
6. Suggested follow-up questions.

## Moderation Plan

Community starts with prayer intentions only.

V1 controls:

- All public intentions can enter a pending moderation queue.
- Users can report intentions.
- Admins can hide or remove content.
- Sensitive intentions can be private or group-only.
- No public debate threads in V1.
- No anonymous theological claims presented as teaching.

Potential automated checks:

- Profanity.
- Harassment.
- Self-harm risk.
- Personal data exposure.
- Anti-Catholic mockery.
- Political flame content.

## Security And Privacy

- Do not expose private prayer intentions by default.
- Allow private or group-only intentions.
- Keep saved answers private to the user.
- Use row-level security in Supabase.
- Separate clergy/advisor verification from ordinary user accounts.
- Avoid storing confession-like personal details in a way that encourages users to treat the app as a confessor.

## Development Milestones

### Milestone 1: Static Prototype

Status: complete.

- Visual MVP screens.
- Clickable prototype.
- Sample Ask loop.
- Product blueprint.

### Milestone 2: App Skeleton

- Expo app.
- Tabs: Today, Ask, Library, Pray, Community.
- Shared design system.
- Local mock data.
- Save topic locally.

### Milestone 3: Backend Foundation

- Supabase project.
- Auth.
- Profiles.
- Prayers.
- Prayer intentions.
- Saved answers.
- Row-level security.

### Milestone 4: Source Library

- Sources table.
- Source chunks table.
- First 10-20 approved sources.
- Manual source import script.
- Embedding generation.

### Milestone 5: Cited Ask API

- Ask endpoint.
- Query classification.
- Vector retrieval.
- Authority tier ranking.
- Answer generation.
- Citation drawer.
- Save answer.

### Milestone 6: Prayer MVP

- Rosary flow.
- Divine Mercy Chaplet.
- Traditional prayer library.
- Prayer reminders.
- Latin/English toggle.

### Milestone 7: Community MVP

- Prayer intention wall.
- Post intention.
- I prayed action.
- Report flow.
- Moderation queue.

### Milestone 8: Advisor Review

- Review source policy.
- Review first source set.
- Review chatbot answer rules.
- Review sensitive topic handling.
- Review static prayer content.

## First Engineering Task

Create the app skeleton:

- Expo + TypeScript project.
- Implement the five V1 tabs.
- Port the current prototype screens into React Native components.
- Use local mock data for Ask, Library, Pray, and Community.
- Keep the cited Ask loop as the first real interaction.

This gives the product a real codebase before connecting the backend.
