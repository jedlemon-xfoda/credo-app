# The Ordinary Catholic Product Blueprint

## Product Summary

The Ordinary Catholic is a Catholic learning, prayer, reference, and community app for everyday Catholics. It combines a trusted Catholic library, a citation-first chatbot, traditional prayer tools, and a reverent prayer-first community.

Positioning:

> Ancient faith for ordinary days.

Core promise:

> Learn the faith, pray with the Church, and find answers from trusted Catholic sources.

## Target Users

- Everyday Catholics who want clear answers without needing a theology degree.
- Converts and reverts learning Catholic doctrine.
- Practicing Catholics trying to build a daily prayer rhythm.
- Parents, catechists, and parish leaders who need reliable references.
- Catholics who want community without chaotic debate culture.

## MVP Scope

The first version should focus on five core areas:

1. Today
   - Feast or saint of the day.
   - Daily prayer.
   - Readings link or reading reference.
   - Short catechism or doctrine reflection.
   - Suggested topic path.

2. Ask
   - Catholic chatbot with citations.
   - Answers limited to approved Catholic source material.
   - Labels for source type and authority.
   - Follow-up questions.
   - Save answer or topic.

3. Library
   - Curated topic paths.
   - Catechism references.
   - Vatican document links.
   - New Advent references.
   - Church Fathers, saints, and Aquinas as commentary/tradition sources.

4. Pray
   - Rosary guide.
   - Divine Mercy Chaplet.
   - Core traditional prayers.
   - Novenas.
   - Prayer reminders.
   - Latin/English toggle where appropriate.

5. Community
   - Prayer intention wall.
   - "I prayed" action.
   - Parish or group circles later.
   - Moderation and reporting from day one.

## Not In V1

- Open debate forums.
- User-generated theological answers treated as doctrine.
- Complex parish networking.
- Full social media feed.
- Unmoderated comments.
- Attempting to ingest every Catholic source at once.
- Clergy advice impersonation.

## Source And Trust Policy

The trust layer is the product. Every chatbot answer should show where it came from.

### Source Tiers

Tier 1: Official and foundational

- Sacred Scripture.
- Catechism of the Catholic Church.
- Vatican documents.
- Ecumenical councils.
- Papal encyclicals and apostolic documents.

Tier 2: Tradition and theology

- Church Fathers.
- Doctors of the Church.
- St. Thomas Aquinas.
- Writings of canonized saints.

Tier 3: Reference and historical commentary

- New Advent Catholic Encyclopedia.
- Historical Catholic reference works.
- Approved explanatory articles when reviewed.

Tier 4: Community

- Prayer intentions.
- Group discussion.
- User reflections.
- Never used as doctrinal authority.

### Chatbot Rules

- Always cite sources.
- Separate official teaching from theological commentary.
- Say when a topic is disputed, disciplinary, pastoral, historical, or doctrinal.
- Avoid pretending to give sacramental, legal, medical, or pastoral direction.
- Encourage users to speak to a priest for confession, spiritual direction, annulment questions, and personal moral crises.
- Refuse anti-Catholic, mocking, or bad-faith community content where appropriate.
- Prefer "The Church teaches..." only when the answer is grounded in official sources.

## First Content Starter Pack

### First 50 Ask Topics

- Eucharist and Real Presence.
- Confession.
- Mortal and venial sin.
- Purgatory.
- Mary as Mother of God.
- Immaculate Conception.
- Assumption of Mary.
- Saints and intercession.
- The Rosary.
- Divine Mercy.
- The Mass.
- Holy days of obligation.
- Prayer and meditation.
- Scripture and Tradition.
- Papal authority.
- Apostolic succession.
- The Trinity.
- Incarnation.
- Grace.
- Salvation.
- Baptism.
- Confirmation.
- Marriage.
- Holy Orders.
- Anointing of the Sick.
- The Ten Commandments.
- Beatitudes.
- Catholic moral teaching.
- Natural law.
- Conscience.
- Fasting and abstinence.
- Lent.
- Advent.
- Easter.
- Liturgical calendar.
- Angels.
- Demons and spiritual warfare.
- Relics.
- Indulgences.
- Sacred images.
- Latin Mass and ordinary form.
- Vatican II.
- Church Fathers.
- Aquinas.
- Doctors of the Church.
- Bible canon.
- Prayer to saints.
- Scapulars and sacramentals.
- Works of mercy.
- Catholic social teaching.

### First Prayer Library

- Sign of the Cross.
- Our Father.
- Hail Mary.
- Glory Be.
- Apostles' Creed.
- Nicene Creed.
- Act of Contrition.
- Morning Offering.
- Angelus.
- Regina Caeli.
- Memorare.
- St. Michael Prayer.
- Anima Christi.
- Hail Holy Queen.
- Rosary.
- Divine Mercy Chaplet.
- Litany of Loreto.
- Litany of the Sacred Heart.
- Prayer Before Meals.
- Prayer After Meals.
- Guardian Angel Prayer.
- Prayer to St. Joseph.
- Prayer to the Holy Spirit.
- Prayer for the Faithful Departed.
- Prayer for Vocations.

### First Novenas

- Divine Mercy Novena.
- St. Joseph Novena.
- Sacred Heart Novena.
- Holy Spirit Novena.
- Our Lady Undoer of Knots Novena.

## Suggested Tech Stack

### Mobile App

- Expo / React Native for iOS and Android.
- TypeScript.
- Native navigation with tabs and stacked detail screens.

### Backend

- Supabase for authentication, Postgres database, storage, and moderation tables.
- Postgres with pgvector or a managed vector store for retrieval.
- OpenAI API for citation-first answer generation.
- Server-side source retrieval before the model answers.

### Core Tables

- users
- profiles
- sources
- source_chunks
- topics
- prayers
- novenas
- saved_topics
- saved_answers
- prayer_intentions
- intention_prayers
- reports
- moderation_queue

## Retrieval And Citation Flow

1. User asks a question.
2. App classifies topic and sensitivity.
3. Search trusted source chunks.
4. Rank sources by authority tier.
5. Generate answer only from retrieved material.
6. Attach citations and source tier labels.
7. Show "source drawer" with links and snippets.
8. Allow user to save the answer or ask a follow-up.

## Community Moderation Principles

- Prayer-first, not debate-first.
- No user content presented as official Catholic teaching.
- Report and moderation tools in V1.
- Sensitive intentions can be private or group-only.
- No direct spiritual direction claims from anonymous users.
- Future clergy/mentor features should use verified roles.

## Success Metrics

- Daily active prayer users.
- Questions asked with saved answers.
- Citation click-through rate.
- Completed prayer sessions.
- Posted intentions and "I prayed" actions.
- Saved topics.
- Retention after 7 and 30 days.

## Advisor Review Packet

Before building the real chatbot, ask a priest, deacon, theologian, or qualified catechist to review:

- Source tier policy.
- First 50 topics.
- Chatbot refusal and caution rules.
- Community moderation policy.
- Language around confession, moral theology, and pastoral care.
- Whether the app should include an imprimatur-style review process for static prayer/doctrine content.

Key advisor questions:

- Are these source tiers doctrinally appropriate?
- What topics need extra caution?
- What should the chatbot never answer definitively?
- What language should be used around disputed or disciplinary topics?
- What should be reviewed before public launch?

## Recommended Next Build Step

Build a functional vertical slice:

> Ask a Catholic question -> retrieve trusted snippets -> generate cited answer -> open source drawer -> save topic.

This proves the core trust system before expanding the rest of the app.
