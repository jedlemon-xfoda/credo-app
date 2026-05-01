You are a principal mobile engineer, senior UX engineer, and founding product designer. Build the MVP for a Catholic mobile app called CREDO.

Working name: CREDO
Tagline: Understand the Mass. Live the Faith.
Category line: The quiet companion for Sunday Mass.

Important: App name must be configurable in a single constants file because it may later become Traditio or Via.

Build target:
- React Native with Expo
- TypeScript
- Expo Router
- Local mock data for MVP
- AsyncStorage for local user settings/reflections
- No backend yet
- No AI chatbot
- No payments
- No social features
- No parish/school tooling in v1

PRODUCT THESIS
CREDO is not a Catholic content dashboard. It is a quiet Sunday companion organized around one sacred rhythm:

Prepare → Attend → Receive → Live

The user opens CREDO to prepare for Sunday Mass, attend with understanding, reflect after Mass, and carry one truth into the week.

SACRED SOFTWARE PRINCIPLES
1. Sunday is home.
2. One next step per screen.
3. The app should disappear at Mass.
4. Prayer Mode is the signature feature.
5. Beauty serves worship.
6. No gamified holiness.
7. No social feed.
8. No noisy notifications.
9. No upgrade prompts during prayer/Mass.
10. Trust is quiet, visible, and source-based.

PRIMARY NAVIGATION
Three bottom tabs:
1. Sunday
2. Mass
3. Way

Sunday is the default tab and home.

V1 SCOPE ONLY
Build only:
- Welcome
- One-question onboarding
- Adaptive Sunday Home
- Prepare flow: Readings + What to Notice
- Prayer Mode for Mass
- Receive reflection
- Live This Week
- Way reflections list
- Optional Mass Section deep dive

Do NOT build in v1:
- Treasury tab
- Doctrine maps as a primary nav
- Mercy/confession companion
- Domestic Church mode
- Catechist mode
- Source library
- AI chat
- Payments/subscription
- Social/group features
- Parish/school features

DESIGN SYSTEM
Use final mockup as visual reference. Create a premium, contemplative Catholic aesthetic.

Colors:
- background: #FBF7EF
- surface: #FFFDF8
- surfaceWarm: #F6EDE2
- burgundy: #8B1E2D
- burgundyDark: #681421
- navyBlack: #07090D
- charcoal: #211C18
- mutedText: #746B60
- gold: #B9903D
- goldMuted: #C9A86A
- border: #E2D6C8
- stone: #D9CEC0

Typography:
- Display headings: serif fallback such as Georgia / Times New Roman if custom font unavailable
- Body: system sans / Inter-like fallback
- Minimum body size 16px
- Generous line height
- Large readable type in Prayer Mode

Visual rules:
- warm ivory/parchment background
- burgundy primary CTA
- gold only for sacred emphasis
- lots of whitespace
- few borders
- subtle rounded cards
- restrained icons
- no gaudy ornament
- no confetti, badges, points, streaks

APP STRUCTURE
app/
  _layout.tsx
  index.tsx
  onboarding.tsx
  (tabs)/
    _layout.tsx
    sunday/index.tsx
    sunday/prepare.tsx
    sunday/receive.tsx
    sunday/live.tsx
    mass/index.tsx
    mass/prayer-mode.tsx
    mass/section/[id].tsx
    way/index.tsx
components/
  AppScreen.tsx
  SacredCard.tsx
  PrimaryButton.tsx
  SecondaryButton.tsx
  RhythmAction.tsx
  BottomTabIcon.tsx
  StepIndicator.tsx
  TrustFooter.tsx
  ReflectionInput.tsx
  PrayerModeView.tsx
  MassSectionCard.tsx
constants/
  brand.ts
  theme.ts
data/
  sunday.ts
  massSections.ts
  reflections.ts
hooks/
  useLocalStorage.ts
  useAdaptiveSundayState.ts
  useReflections.ts
types/
  index.ts
utils/
  date.ts
  sacredTime.ts

CORE SCREENS
1. Welcome
- Logo CREDO
- Tagline
- cathedral line-art background or soft placeholder
- CTA: Begin
- secondary: Already have an account? Sign in (nonfunctional placeholder)

2. One-question onboarding
Question: What brings you here?
Options:
- I want to prepare for Mass
- I want to understand the Mass
- I’m returning to the faith
- I’m exploring Catholicism
CTA: Continue
After onboarding, route to Sunday Home.
Store response locally.

3. Sunday Home
Adaptive by sacred time. For MVP, implement logic based on day/time placeholder:
- Saturday/Sunday morning: emphasize Prepare
- Sunday during likely Mass window: emphasize Attend / Prayer Mode
- Sunday afternoon/evening: emphasize Receive
- Monday–Friday: emphasize Live

Elements:
- Today is / 5th Sunday of Easter / date
- greeting copy: “Begin with this Sunday.” or adaptive copy
- primary rhythm list:
  Prepare — Before Mass
  Attend — During Mass
  Receive — After Mass
  Live — This Week
- weekly truth card: “The Eucharist forms us to become a gift.”
- bottom nav: Sunday / Mass / Way

4. Prepare flow
Use step-by-step, not dashboard.
Only 2 steps in v1:
Step 1: Readings
- First Reading: Acts 14:21–27
- Responsorial Psalm: Ps 145:8–9, 10–11, 12–13
- Second Reading: Rev 21:1–5a
- Gospel: Jn 13:31–33a, 34–35
- prompt: “Take a moment to read slowly and prayerfully.”
CTA: Continue

Step 2: What to Notice at Mass
Cards:
- The altar: It is the place of sacrifice, not a stage.
- The Offertory: We offer our gifts — and ourselves — with Christ.
- The Eucharist: The Lord gives Himself to us completely.
- closing prompt: “Let these moments help you pray more deeply.”
CTA: Continue to Prayer Mode or Done

5. Mass Home
Purpose: choose Study Mode or Prayer Mode.
Elements:
- Header: Mass
- Primary card: Prayer Mode — “A quiet companion during Mass.”
- Secondary card: Study Mode — “Understand each part of the Mass.”
- List of Mass sections:
  Introductory Rites
  Liturgy of the Word
  Offertory
  Eucharistic Prayer
  Communion Rites
  Concluding Rites

6. Prayer Mode
Flagship experience.
Full screen, dark, no tab bar.
Elements:
- Exit top-left
- Save icon top-right
- Section title: THE OFFERTORY
- Main line: “With these gifts, we offer ourselves with Christ.”
- Supporting line: “We unite our offering to the sacrifice of Jesus on the cross.”
- Previous/next controls
- Save for after Mass button
Rules:
- no promotions
- no gamification
- no noisy UI
- no tab bar
- large readable type
- offline-safe data
- visually feels quiet and sacred

7. Receive
Prompt: “Where did the Lord draw your attention?”
Subcopy: “A moment, a word, a grace.”
Text input optional.
Optional chips:
- A word from the readings
- A moment of silence
- The Eucharist
- A need for Confession
- Pray for a person
CTA: Save Reflection
Store locally with date and Sunday title.

8. Live This Week
Elements:
- “Carry this truth into your week.”
- This week’s truth: “The Eucharist forms us to become a gift.”
- Practice: “Offer one hidden act of charity this week.”
- Family question: “How can our home become more like the Mass?”
CTA: I’m ready

9. Way
Purpose: saved reflections and simple path.
Elements:
- Header: Way
- Subcopy: “A place to return to what you’ve received.”
- List saved reflections from AsyncStorage
- Empty state if none: “After Mass, your reflections will appear here.”

10. Mass Section Detail
Optional deep dive from Mass home.
Example: Offertory
Tabs: What / Why / How
What: Bread and wine are brought to the altar. They will become the Body and Blood of Christ.
Why: Our gifts are joined to Jesus’ sacrifice. We offer ourselves with Him.
How: Offer your week, your family, your work, your suffering.
CTA: Go deeper (nonfunctional placeholder)

DATA TYPES
Define interfaces:
UserProfile
SundayContent
Reading
PrepareStep
MassSection
Reflection
WeeklyTruth
OnboardingChoice

LOCAL STORAGE
Use AsyncStorage keys:
credo:onboardingComplete
credo:onboardingChoice
credo:reflections
credo:settings

ADAPTIVE SUNDAY STATE
Create function getSundayMode(date: Date): 'prepare' | 'attend' | 'receive' | 'live'
For MVP:
- Saturday and Sunday before noon = prepare
- Sunday 12:00–14:00 = attend
- Sunday 14:00–23:59 = receive
- Monday–Friday = live
Allow easy adjustment later.

ACCESSIBILITY
- Minimum touch target 44px
- Body text >=16px
- High contrast burgundy buttons
- Do not rely on color alone
- Support Dynamic Type if possible
- Prayer Mode large text
- Screen reader labels for icons
- Use semantic button labels

BUILD QUALITY
- Clean TypeScript
- Reusable components
- No hardcoded styles inside screens where avoidable
- Central theme tokens
- Mock data centralized
- Good file naming
- Comments explaining future backend/AI/payment points

DELIVERABLE
Create a working Expo app that can run with:
npm install
npm run start

Focus on beauty, restraint, and usability. Do not overbuild.
The best v1 is small, quiet, and excellent.
