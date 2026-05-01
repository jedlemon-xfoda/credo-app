import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  answers,
  comparisonPassages,
  findAnswer,
  intentions,
  prayers,
  sourceCollections,
  topics,
  tradQuestions,
  type Answer,
  type Prayer,
  type Topic
} from "./content";
import { composeAnswer, type ComposedAnswer } from "./answerComposer";
import { ErrorBoundary } from "./ErrorBoundary";
import {
  getStored,
  keys,
  loadSavedAnswers,
  postIntention,
  saveAnswer,
  getCurrentUserEmail,
  signInWithEmail,
  signOut,
  setStored,
  type SavedAnswerRecord
} from "./dataService";
import { retrieveChunks, type RetrievedChunk } from "./retrieval";
import { isSupabaseConfigured } from "./supabaseClient";
import "./styles.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/service-worker.js");
  });
}

type TabKey = "today" | "ask" | "library" | "saved" | "pray" | "community" | "account";
type DetailKey = "sources" | "topic" | "rosary" | "prayer" | "intention" | null;

type Preferences = {
  goal: "Learn" | "Pray" | "Ask" | "Community";
  experience: "New" | "Returning" | "Practicing" | "Advanced";
  prayerFocus: "Rosary" | "Divine Mercy" | "Daily Prayers" | "Novenas";
};

type PrayerSessionPrefs = {
  length: "Short" | "Standard" | "Deep";
  guide: "Silent" | "Chanted" | "Lectio";
  background: boolean;
};

const defaultPreferences: Preferences = {
  goal: "Learn",
  experience: "Practicing",
  prayerFocus: "Rosary"
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "ask", label: "Ask" },
  { key: "library", label: "Library" },
  { key: "saved", label: "Saved" },
  { key: "pray", label: "Pray" },
  { key: "community", label: "Community" },
  { key: "account", label: "Account" }
];

const sourceModeLabels = ["Trad Vault", "Bible Compare", "TLM School", "Current Questions"] as const;

const liturgicalToday = {
  date: "April 28",
  title: "St. Peter Chanel and St. Louis de Montfort",
  body:
    "The Church remembers missionary courage and Marian devotion today. Carry one ordinary act of witness into prayer, work, or family life.",
  source: "Vatican News saint calendar, April 28"
};

const dailyReadings = {
  date: "April 28, 2026",
  title: "Tuesday of the Fourth Week of Easter",
  readingOne: "Acts 11:19-26",
  psalm: "Psalm 87:1b-3, 4-5, 6-7",
  gospel: "John 10:22-30",
  prompt: "Christ says his sheep hear his voice. Ask how Catholic prayer, Scripture, and the Church train ordinary people to listen."
};

const rosaryMysteries = {
  Joyful: ["The Annunciation", "The Visitation", "The Nativity", "The Presentation", "The Finding in the Temple"],
  Luminous: ["The Baptism of the Lord", "The Wedding at Cana", "The Proclamation of the Kingdom", "The Transfiguration", "The Institution of the Eucharist"],
  Sorrowful: ["The Agony in the Garden", "The Scourging at the Pillar", "The Crowning with Thorns", "The Carrying of the Cross", "The Crucifixion"],
  Glorious: ["The Resurrection", "The Ascension", "The Descent of the Holy Spirit", "The Assumption of Mary", "The Coronation of Mary"]
} as const;

type MysterySet = keyof typeof rosaryMysteries;

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => getStored<TabKey>(keys.activeTab, "today"));
  const [question, setQuestion] = useState(answers[0].question);
  const [answer, setAnswer] = useState<Answer>(answers[0]);
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswerRecord[]>(() =>
    getStored<SavedAnswerRecord[]>(keys.savedAnswers, [])
  );
  const [detail, setDetail] = useState<DetailKey>(null);
  const [prayedCounts, setPrayedCounts] = useState<Record<string, number>>(() =>
    getStored<Record<string, number>>(keys.prayedCounts, {})
  );
  const [prayedPrayers, setPrayedPrayers] = useState<Record<string, number>>(() =>
    getStored<Record<string, number>>(keys.prayedPrayers, {})
  );
  const [prayerReminders, setPrayerReminders] = useState<Record<string, boolean>>(() =>
    getStored<Record<string, boolean>>(keys.prayerReminders, {})
  );
  const [challengeProgress, setChallengeProgress] = useState(() => getStored<number>(keys.challengeProgress, 3));
  const [prayerSessionPrefs, setPrayerSessionPrefs] = useState<PrayerSessionPrefs>(() =>
    getStored<PrayerSessionPrefs>(keys.prayerSessionPrefs, {
      length: "Standard",
      guide: "Silent",
      background: false
    })
  );
  const [postedIntentions, setPostedIntentions] = useState<string[]>(() =>
    getStored<string[]>(keys.postedIntentions, [])
  );
  const [preferences, setPreferences] = useState<Preferences>(() =>
    getStored<Preferences>(keys.preferences, defaultPreferences)
  );
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem(keys.onboarded));
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [retrievedChunks, setRetrievedChunks] = useState<RetrievedChunk[]>(() =>
    retrieveChunks(answers[0].question)
  );
  const [composedAnswer, setComposedAnswer] = useState<ComposedAnswer>(() =>
    composeAnswer(answers[0].question, retrieveChunks(answers[0].question))
  );
  const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer>(prayers.find((prayer) => prayer.title === "Rosary") || prayers[0]);

  const saved = savedAnswers.some((item) => item.key === answer.key);

  useEffect(() => {
    setStored(keys.activeTab, activeTab);
  }, [activeTab]);

  useEffect(() => {
    setStored(keys.savedAnswers, savedAnswers);
  }, [savedAnswers]);

  useEffect(() => {
    setStored(keys.prayedCounts, prayedCounts);
  }, [prayedCounts]);

  useEffect(() => {
    setStored(keys.prayedPrayers, prayedPrayers);
  }, [prayedPrayers]);

  useEffect(() => {
    setStored(keys.prayerReminders, prayerReminders);
  }, [prayerReminders]);

  useEffect(() => {
    setStored(keys.challengeProgress, challengeProgress);
  }, [challengeProgress]);

  useEffect(() => {
    setStored(keys.prayerSessionPrefs, prayerSessionPrefs);
  }, [prayerSessionPrefs]);

  useEffect(() => {
    setStored(keys.postedIntentions, postedIntentions);
  }, [postedIntentions]);

  useEffect(() => {
    setStored(keys.preferences, preferences);
  }, [preferences]);

  useEffect(() => {
    void loadSavedAnswers().then(setSavedAnswers);
    void getCurrentUserEmail().then(setUserEmail);
  }, []);

  if (showOnboarding) {
    return (
      <Onboarding
        initialPreferences={preferences}
        onComplete={(nextPreferences) => {
          setPreferences(nextPreferences);
          localStorage.setItem(keys.onboarded, "true");
          setShowOnboarding(false);
        }}
      />
    );
  }

  const activeScreen = useMemo(() => {
    if (detail === "sources") {
      return (
        <SourceDetail
          answer={answer}
          composedAnswer={composedAnswer}
          retrievedChunks={retrievedChunks}
          onBack={() => setDetail(null)}
        />
      );
    }
    if (detail === "topic") return <TopicDetail topic={selectedTopic} onBack={() => setDetail(null)} />;
    if (detail === "rosary") return <RosaryDetail onBack={() => setDetail(null)} />;
    if (detail === "prayer") {
      return (
        <PrayerDetail
          prayer={selectedPrayer}
          prayedCount={prayedPrayers[selectedPrayer.title] || 0}
          reminderEnabled={Boolean(prayerReminders[selectedPrayer.title])}
          sessionPrefs={prayerSessionPrefs}
          onBack={() => setDetail(null)}
          onSessionPrefsChange={setPrayerSessionPrefs}
          onMarkPrayed={() =>
            setPrayedPrayers((current) => ({
              ...current,
              [selectedPrayer.title]: (current[selectedPrayer.title] || 0) + 1
            }))
          }
          onToggleReminder={() =>
            setPrayerReminders((current) => ({
              ...current,
              [selectedPrayer.title]: !current[selectedPrayer.title]
            }))
          }
        />
      );
    }
    if (detail === "intention") {
      return (
        <IntentionDetail
          onBack={() => setDetail(null)}
          onPost={(body) => {
            void postIntention(body).then(() => {
              setPostedIntentions((current) => [body, ...current]);
              setActiveTab("community");
              setDetail(null);
            });
          }}
        />
      );
    }

    if (activeTab === "today") {
      return (
        <TodayScreen
          preferences={preferences}
          savedCount={savedAnswers.length}
          prayedTotal={Object.values(prayedPrayers).reduce((total, count) => total + count, 0)}
          intentionCount={postedIntentions.length + intentions.length}
          challengeProgress={challengeProgress}
          onOpenTopic={() => {
            setSelectedTopic(topics[0]);
            setDetail("topic");
          }}
          onOpenAsk={() => setActiveTab("ask")}
          onOpenDailyReading={() => {
            const nextQuestion = "What does John 10:22-30 teach Catholics about hearing Christ's voice?";
            const nextAnswer = findAnswer(nextQuestion);
            const nextChunks = retrieveChunks(nextQuestion);
            setQuestion(nextQuestion);
            setAnswer(nextAnswer);
            setRetrievedChunks(nextChunks);
            setComposedAnswer(composeAnswer(nextQuestion, nextChunks));
            setActiveTab("ask");
          }}
          onOpenPrayer={() => {
            const nextPrayer =
              prayers.find((prayer) => prayer.title === preferences.prayerFocus) ||
              prayers.find((prayer) => prayer.category === "Daily") ||
              prayers[0];
            setSelectedPrayer(nextPrayer);
            setActiveTab("pray");
            setDetail(nextPrayer.title === "Rosary" ? "rosary" : "prayer");
          }}
          onOpenCommunity={() => setActiveTab("community")}
          onAdvanceChallenge={() => setChallengeProgress((current) => (current >= 9 ? 1 : current + 1))}
          onEditPreferences={() => setShowOnboarding(true)}
        />
      );
    }
    if (activeTab === "ask") {
      return (
        <AskScreen
          answer={answer}
          question={question}
          saved={saved}
          onQuestionChange={setQuestion}
          onSearch={() => {
            const nextAnswer = findAnswer(question);
            const nextChunks = retrieveChunks(question);
            setAnswer(nextAnswer);
            setRetrievedChunks(nextChunks);
            setComposedAnswer(composeAnswer(question, nextChunks));
          }}
          onSuggested={(nextQuestion) => {
            const nextAnswer = findAnswer(nextQuestion);
            const nextChunks = retrieveChunks(nextAnswer.question);
            setQuestion(nextAnswer.question);
            setAnswer(nextAnswer);
            setRetrievedChunks(nextChunks);
            setComposedAnswer(composeAnswer(nextAnswer.question, nextChunks));
          }}
          onSave={() =>
            void saveAnswer(
              { key: answer.key, question: answer.question, title: composedAnswer.title },
              composedAnswer.body,
              retrievedChunks
            ).then(() =>
              setSavedAnswers((current) =>
                current.some((item) => item.key === answer.key)
                  ? current
                  : [{ key: answer.key, question: answer.question, title: composedAnswer.title }, ...current]
              )
            )
          }
          onOpenSources={() => setDetail("sources")}
          retrievedChunks={retrievedChunks}
          composedAnswer={composedAnswer}
        />
      );
    }
    if (activeTab === "library") {
      return (
        <LibraryScreen
          onOpenTopic={(topic) => {
            setSelectedTopic(topic);
            setDetail("topic");
          }}
        />
      );
    }
    if (activeTab === "saved") {
      return (
        <SavedScreen
          savedAnswers={savedAnswers}
          onOpenAnswer={(savedAnswer) => {
            const nextAnswer = findAnswer(savedAnswer.question);
            const nextChunks = retrieveChunks(savedAnswer.question);
            setQuestion(savedAnswer.question);
            setAnswer(nextAnswer);
            setRetrievedChunks(nextChunks);
            setComposedAnswer(composeAnswer(savedAnswer.question, nextChunks));
            setActiveTab("ask");
          }}
          onClear={() => {
            setSavedAnswers([]);
            setStored(keys.savedAnswers, []);
          }}
        />
      );
    }
    if (activeTab === "pray") {
      return (
        <PrayScreen
          prayedPrayers={prayedPrayers}
          prayerReminders={prayerReminders}
          onOpenPrayer={(prayer) => {
            setSelectedPrayer(prayer);
            setDetail(prayer.title === "Rosary" ? "rosary" : "prayer");
          }}
        />
      );
    }
    if (activeTab === "account") {
      return (
        <AccountScreen
          email={userEmail}
          preferences={preferences}
          savedCount={savedAnswers.length}
          onEditPreferences={() => setShowOnboarding(true)}
          onSignedIn={(email) => setUserEmail(email)}
          onSignedOut={() => setUserEmail(null)}
          onResetLocalData={() => {
            localStorage.clear();
            window.location.reload();
          }}
        />
      );
    }
    return (
      <CommunityScreen
        postedIntentions={postedIntentions}
        prayedCounts={prayedCounts}
        onOpenPost={() => setDetail("intention")}
        onPrayed={(body) =>
          setPrayedCounts((current) => ({
            ...current,
            [body]: (current[body] || 0) + 1
          }))
        }
      />
    );
  }, [activeTab, answer, challengeProgress, composedAnswer, detail, postedIntentions, prayedCounts, prayedPrayers, prayerReminders, prayerSessionPrefs, preferences, question, retrievedChunks, saved, selectedPrayer]);

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <img src="/ordinary-catholic-logo.jpg" alt="The Ordinary Catholic seal" />
          <div>
            <span>The Ordinary</span>
            <strong>Catholic</strong>
          </div>
        </div>
        <nav className="tabs">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.key ? "active" : ""}
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setDetail(null);
              }}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span>Release Candidate</span>
          <p>Learn, ask, cite, pray, participate.</p>
          <strong>{savedAnswers.length} saved</strong>
          <small>{isSupabaseConfigured ? "Supabase ready" : "Local mode"}</small>
        </div>
      </aside>
      <section className="screen-panel">{activeScreen}</section>
    </main>
  );
}

function AccountScreen({
  email,
  preferences,
  savedCount,
  onEditPreferences,
  onSignedIn,
  onSignedOut,
  onResetLocalData
}: {
  email: string | null;
  preferences: Preferences;
  savedCount: number;
  onEditPreferences: () => void;
  onSignedIn: (email: string | null) => void;
  onSignedOut: () => void;
  onResetLocalData: () => void;
}) {
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState(
    isSupabaseConfigured ? "Sign in with a magic link." : "Local mode is active. Add Supabase env vars to enable sign-in."
  );

  return (
    <>
      <Header eyebrow="Account" title="Your ordinary Catholic rhythm." badge={isSupabaseConfigured ? "Supabase ready" : "Local mode"} />
      <section className="account-grid">
        <article className="info-card account-card">
          <p className="eyebrow">Status</p>
          <h2>{email ? "Signed in" : "Guest mode"}</h2>
          <p>{email ? email : "Your saves and preferences are stored in this browser for now."}</p>
          {email ? (
            <button
              className="secondary-action"
              onClick={() => {
                void signOut().then(() => {
                  onSignedOut();
                  setMessage("Signed out.");
                });
              }}
              type="button"
            >
              Sign out
            </button>
          ) : (
            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                void signInWithEmail(emailInput).then((result) => {
                  setMessage(result.message);
                  if (!result.ok) onSignedIn(null);
                });
              }}
            >
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                placeholder="you@example.com"
              />
              <button className="primary-action" type="submit">Send magic link</button>
            </form>
          )}
          <p className="mode-message">{message}</p>
        </article>
        <article className="info-card account-card">
          <p className="eyebrow">Preferences</p>
          <h2>{preferences.goal} first</h2>
          <p>
            Experience: {preferences.experience}. Prayer focus: {preferences.prayerFocus}. Saved answers: {savedCount}.
          </p>
          <button className="secondary-action" onClick={onEditPreferences} type="button">
            Edit setup
          </button>
        </article>
        <article className="info-card account-card">
          <p className="eyebrow">Testing</p>
          <h2>Reset this device</h2>
          <p>Clear onboarding, saved answers, prayer counts, posted intentions, and local preferences on this browser.</p>
          <button
            className="danger-action"
            onClick={() => {
              if (window.confirm("Clear all local test data for The Ordinary Catholic on this browser?")) {
                onResetLocalData();
              }
            }}
            type="button"
          >
            Clear local test data
          </button>
        </article>
        <article className="info-card account-card trust-card">
          <p className="eyebrow">Trust Policy</p>
          <h2>Sources before answers</h2>
          <p>
            Doctrine answers should come from Scripture, Catechism, Vatican documents, councils,
            saints, and reviewed Catholic references. Community content is never treated as
            doctrine.
          </p>
          <div className="trust-tier-list">
            <span>Tier 1: Scripture, Catechism, Vatican, councils</span>
            <span>Tier 2: Fathers, doctors, saints, Aquinas</span>
            <span>Tier 3: New Advent and reviewed reference material</span>
          </div>
        </article>
      </section>
    </>
  );
}

function Onboarding({
  initialPreferences,
  onComplete
}: {
  initialPreferences: Preferences;
  onComplete: (preferences: Preferences) => void;
}) {
  const [draft, setDraft] = useState(initialPreferences);

  return (
    <main className="onboarding-shell">
      <section className="onboarding-panel">
        <div className="brand onboarding-brand">
          <img src="/ordinary-catholic-logo.jpg" alt="The Ordinary Catholic seal" />
          <div>
            <span>The Ordinary</span>
            <strong>Catholic</strong>
          </div>
        </div>
        <p className="eyebrow">First setup</p>
        <h1>Build your Catholic rhythm.</h1>
        <p className="onboarding-copy">
          Choose what you want help with first. The app will shape Today around your goal,
          prayer focus, and experience level.
        </p>
        <PreferenceGroup
          title="Primary goal"
          options={["Learn", "Pray", "Ask", "Community"]}
          value={draft.goal}
          onChange={(goal) => setDraft((current) => ({ ...current, goal: goal as Preferences["goal"] }))}
        />
        <PreferenceGroup
          title="Experience"
          options={["New", "Returning", "Practicing", "Advanced"]}
          value={draft.experience}
          onChange={(experience) =>
            setDraft((current) => ({ ...current, experience: experience as Preferences["experience"] }))
          }
        />
        <PreferenceGroup
          title="Prayer focus"
          options={["Rosary", "Divine Mercy", "Daily Prayers", "Novenas"]}
          value={draft.prayerFocus}
          onChange={(prayerFocus) =>
            setDraft((current) => ({ ...current, prayerFocus: prayerFocus as Preferences["prayerFocus"] }))
          }
        />
        <button className="primary-action onboarding-submit" onClick={() => onComplete(draft)} type="button">
          Enter The Ordinary Catholic
        </button>
      </section>
    </main>
  );
}

function PreferenceGroup({
  title,
  options,
  value,
  onChange
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="preference-group">
      <p className="eyebrow">{title}</p>
      <div className="preference-options">
        {options.map((option) => (
          <button
            className={value === option ? "active" : ""}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}

function Header({ eyebrow, title, badge }: { eyebrow: string; title: string; badge: string }) {
  return (
    <header className="screen-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <span className="trust-badge">{badge}</span>
    </header>
  );
}

function TodayScreen({
  preferences,
  savedCount,
  prayedTotal,
  intentionCount,
  challengeProgress,
  onOpenTopic,
  onOpenAsk,
  onOpenDailyReading,
  onOpenPrayer,
  onOpenCommunity,
  onAdvanceChallenge,
  onEditPreferences
}: {
  preferences: Preferences;
  savedCount: number;
  prayedTotal: number;
  intentionCount: number;
  challengeProgress: number;
  onOpenTopic: () => void;
  onOpenAsk: () => void;
  onOpenDailyReading: () => void;
  onOpenPrayer: () => void;
  onOpenCommunity: () => void;
  onAdvanceChallenge: () => void;
  onEditPreferences: () => void;
}) {
  const recommendation = getTodayRecommendation(preferences);

  return (
    <>
      <Header eyebrow="Today" title="Ancient faith for ordinary days." badge="Source-grounded" />
      <section className="quick-dock" aria-label="Quick actions">
        <button onClick={onOpenPrayer} type="button">
          <span>Pray</span>
          <strong>{preferences.prayerFocus}</strong>
        </button>
        <button onClick={onOpenAsk} type="button">
          <span>Ask</span>
          <strong>Cited answer</strong>
        </button>
        <button onClick={onOpenTopic} type="button">
          <span>Learn</span>
          <strong>Eucharist path</strong>
        </button>
        <button onClick={onOpenCommunity} type="button">
          <span>Intercede</span>
          <strong>{intentionCount} intentions</strong>
        </button>
      </section>
      <section className="personal-panel">
        <div>
          <p className="eyebrow">Your rhythm</p>
          <h2>{recommendation.title}</h2>
          <p>{recommendation.body}</p>
        </div>
        <button className="secondary-action" onClick={onEditPreferences} type="button">
          Edit setup
        </button>
      </section>
      <section className="dashboard-strip">
        <article>
          <span>{prayedTotal}</span>
          <strong>prayers completed</strong>
        </article>
        <article>
          <span>{savedCount}</span>
          <strong>answers saved</strong>
        </article>
        <article>
          <span>{challengeProgress}/9</span>
          <strong>ordinary novena</strong>
        </article>
      </section>
      <section className="today-layout">
        <article className="image-feature">
          <img src="/disputa.jpg" alt="Disputation of the Holy Sacrament artwork" />
          <div>
            <p className="eyebrow">Liturgical Today / {liturgicalToday.date}</p>
            <h2>{liturgicalToday.title}</h2>
            <p>{liturgicalToday.body}</p>
            <small>{liturgicalToday.source}</small>
          </div>
        </article>
        <div className="stack">
          <article className="daily-readings-card">
            <p className="eyebrow">Mass Readings / {dailyReadings.date}</p>
            <h2>{dailyReadings.title}</h2>
            <div className="reading-list">
              <span>Reading 1: {dailyReadings.readingOne}</span>
              <span>Psalm: {dailyReadings.psalm}</span>
              <span>Gospel: {dailyReadings.gospel}</span>
            </div>
            <p>{dailyReadings.prompt}</p>
            <button className="primary-action" onClick={onOpenDailyReading} type="button">
              Ask about today's Gospel
            </button>
          </article>
          <InfoCard
            label={recommendation.cardLabel}
            title={recommendation.cardTitle}
            body={recommendation.cardBody}
            actionLabel="Open topic"
            onAction={onOpenTopic}
          />
          <InfoCard label="Prayer Focus" title={preferences.prayerFocus} body={recommendation.prayerBody} />
          <article className="challenge-card">
            <p className="eyebrow">Daily Challenge</p>
            <h2>Ordinary holiness, day {challengeProgress}</h2>
            <p>{recommendation.challengeBody}</p>
            <div className="progress-track">
              <span style={{ width: `${Math.max(12, (challengeProgress / 9) * 100)}%` }} />
            </div>
            <button className="primary-action" onClick={onAdvanceChallenge} type="button">
              Mark today complete
            </button>
          </article>
        </div>
      </section>
    </>
  );
}

function getTodayRecommendation(preferences: Preferences) {
  const byGoal = {
    Learn: {
      title: "Start with one clear teaching.",
      body: `For a ${preferences.experience.toLowerCase()} Catholic, today's path emphasizes a concise doctrine summary with source links.`,
      cardLabel: "Daily Teaching",
      cardTitle: "The Eucharist is the source and summit.",
      cardBody: "Linked path: Catechism, Vatican II, Trent, Aquinas, and devotional practice.",
      challengeBody: "Read one source card, save one answer, and say one Glory Be for docility."
    },
    Pray: {
      title: "Build the day around prayer.",
      body: `Today's rhythm centers on ${preferences.prayerFocus} and a small act of recollection.`,
      cardLabel: "Prayer Habit",
      cardTitle: `Continue with ${preferences.prayerFocus}.`,
      cardBody: "Use a guided prayer flow, add an intention, and keep the rhythm simple.",
      challengeBody: "Pray slowly enough to notice one phrase, then carry it into the next ordinary task."
    },
    Ask: {
      title: "Bring one question to trusted sources.",
      body: "Today is shaped around asking, reading citations, and saving one answer for later.",
      cardLabel: "Question Path",
      cardTitle: "Ask about Confession, Eucharist, Mary, or Scripture.",
      cardBody: "Every answer separates official teaching, Scripture, Tradition, and commentary.",
      challengeBody: "Ask one question, open the source drawer, and share the answer only after checking citations."
    },
    Community: {
      title: "Pray with the Church around you.",
      body: "Today highlights prayer intentions and gentle participation without turning community into debate.",
      cardLabel: "Community Intention",
      cardTitle: "Pray for one intention today.",
      cardBody: "Mark that you prayed, then carry that intention into your daily prayer.",
      challengeBody: "Choose one intention, pray for it by name, and resist the urge to turn prayer into commentary."
    }
  };

  const prayerBody = {
    Rosary: "Pray one decade with the mystery of the day.",
    "Divine Mercy": "Pause at 3 PM or pray the chaplet when you can.",
    "Daily Prayers": "Begin with the Morning Offering and return at night for an examen.",
    Novenas: "Continue a nine-day devotion and track the intention."
  };

  return {
    ...byGoal[preferences.goal],
    prayerBody: prayerBody[preferences.prayerFocus]
  };
}

function AskScreen({
  answer,
  question,
  saved,
  onQuestionChange,
  onSearch,
  onSuggested,
  onSave,
  onOpenSources,
  retrievedChunks,
  composedAnswer
}: {
  answer: Answer;
  question: string;
  saved: boolean;
  onQuestionChange: (question: string) => void;
  onSearch: () => void;
  onSuggested: (question: string) => void;
  onSave: () => void;
  onOpenSources: () => void;
  retrievedChunks: RetrievedChunk[];
  composedAnswer: ComposedAnswer;
}) {
  const [copied, setCopied] = useState(false);
  const shareText = `${composedAnswer.title}\n\n${composedAnswer.body}\n\nSources: ${
    retrievedChunks.map((chunk) => chunk.citationLabel).join("; ") || "Source review pending"
  }\n\nThe Ordinary Catholic`;

  return (
    <>
      <Header eyebrow="Ask" title="Search Catholic teaching." badge="Citations required" />
      <section className="trust-note">
        <strong>Reference assistant, not spiritual direction.</strong>
        <p>
          Answers are grounded in available Catholic source chunks. For confession, grave sin,
          scrupulosity, annulments, or personal crises, speak with a priest or qualified advisor.
        </p>
      </section>
      <form
        className="ask-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <label htmlFor="question">Ask from trusted Catholic sources</label>
        <div>
          <input id="question" value={question} onChange={(event) => onQuestionChange(event.target.value)} />
          <button type="submit">Search</button>
        </div>
      </form>
      <div className="chip-row">
        {answers.filter((item) => item.key !== "general").map((item) => (
          <button key={item.key} onClick={() => onSuggested(item.question)} type="button">
            {item.key}
          </button>
        ))}
      </div>
      <article className="answer-card">
        <p className="eyebrow">{answer.sourceType} / {composedAnswer.confidence} source match</p>
        <h2>{composedAnswer.title}</h2>
        <p>{composedAnswer.body}</p>
        {composedAnswer.caution ? <p className="pastoral-caution">{composedAnswer.caution}</p> : null}
        <div className="citation-grid">
          {answer.citations.map((citation) => (
            <article key={citation.title}>
              <span>Tier {citation.authorityTier} / {citation.type}</span>
              <strong>{citation.title}</strong>
              <p>{citation.note}</p>
            </article>
          ))}
        </div>
        <div className="follow-up-panel">
          <p className="eyebrow">Suggested follow-ups</p>
          <div className="chip-row">
            {answer.followUps.map((followUp) => (
              <button key={followUp} onClick={() => onSuggested(followUp)} type="button">
                {followUp}
              </button>
            ))}
          </div>
        </div>
        <div className="retrieval-panel">
          <p className="eyebrow">Retrieved source snippets</p>
          <div className="retrieval-list">
            {retrievedChunks.length ? (
              retrievedChunks.map((chunk) => (
                <article key={chunk.citationLabel}>
                  <span>Score {chunk.score} / Tier {chunk.authorityTier}</span>
                  <strong>{chunk.citationLabel}</strong>
                  <p>{chunk.chunkText}</p>
                </article>
              ))
            ) : (
              <article>
                <strong>No local chunks matched yet.</strong>
                <p>Try a core topic such as Eucharist, Confession, Purgatory, or Saints while the full source library is being expanded.</p>
              </article>
            )}
          </div>
        </div>
        <div className="action-row">
          <button className="primary-action" onClick={onOpenSources} type="button">
            Open sources
          </button>
          <button className="secondary-action" onClick={onSave} type="button">
            {saved ? "Saved to library" : "Save topic"}
          </button>
          <button
            className="secondary-action"
            onClick={() => {
              void copyTextToClipboard(shareText).then(() => setCopied(true));
            }}
            type="button"
          >
            {copied ? "Copied answer" : "Copy share card"}
          </button>
        </div>
      </article>
    </>
  );
}

function LibraryScreen({ onOpenTopic }: { onOpenTopic: (topic: Topic) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(topics.map((topic) => topic.category)))];
  const filteredTopics = topics.filter((topic) => {
    const haystack = `${topic.title} ${topic.label} ${topic.body} ${topic.category}`.toLowerCase();
    return (
      (category === "All" || topic.category === category) &&
      haystack.includes(query.toLowerCase())
    );
  });

  return (
    <>
      <Header eyebrow="Library" title="Tradition vault." badge="Primary sources" />
      <section className="trad-hero">
        <div>
          <p className="eyebrow">Traditional Catholic Study</p>
          <h2>Douay. Vulgate. Fathers. Trent. TLM. No watered-down Catholicism.</h2>
          <p>
            Built for Catholics who want doctrine, liturgy, prayer, and Scripture in continuity with the saints,
            councils, old catechisms, and the Roman tradition.
          </p>
        </div>
      </section>
      <section className="mode-grid" aria-label="Traditional library modes">
        {sourceModeLabels.map((label) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{getSourceModeDescription(label)}</strong>
          </article>
        ))}
      </section>
      <FilterBar
        label="Search library"
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        selectedCategory={category}
        onCategoryChange={setCategory}
      />
      <p className="result-count">{filteredTopics.length} topic{filteredTopics.length === 1 ? "" : "s"} found</p>
      {filteredTopics.length ? (
        <section className="library-grid">
          {filteredTopics.map((topic) => (
            <InfoCard
              key={topic.title}
              label={topic.label}
              title={topic.title}
              body={topic.body}
              actionLabel="Open detail"
              onAction={() => onOpenTopic(topic)}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No topic found."
          body="Try Sacraments, Doctrine, Prayer, Eucharist, Confession, Mary, or Purgatory."
          actionLabel="Clear search"
          onAction={() => {
            setQuery("");
            setCategory("All");
          }}
        />
      )}
      <article className="wide-feature">
        <img src="/last-supper.jpg" alt="The Last Supper artwork" />
        <div>
          <p className="eyebrow">Deep Study Path</p>
          <h2>The Mass of the Ages</h2>
          <p>Roman Canon, offertory prayers, ad orientem worship, altar, rail, silence, chant, and sacrifice.</p>
        </div>
      </article>
      <section className="trad-section">
        <Header eyebrow="Trad Vault" title="Primary-source shelves." badge={`${sourceCollections.length} collections`} />
        <section className="library-grid">
          {sourceCollections.map((collection) => (
            <article className="info-card source-card" key={collection.title}>
              <p className="eyebrow">{collection.category} / {collection.depth}</p>
              <h2>{collection.title}</h2>
              <p>{collection.body}</p>
              <span>{collection.source}</span>
            </article>
          ))}
        </section>
      </section>
      <section className="trad-section">
        <Header eyebrow="Bible Compare" title="Douay-Rheims side by side." badge="Translation notes" />
        <section className="comparison-grid">
          {comparisonPassages.map((passage) => (
            <article className="comparison-card" key={passage.reference}>
              <p className="eyebrow">{passage.reference}</p>
              <div className="comparison-columns">
                <section>
                  <span>Douay-Rheims</span>
                  <strong>{passage.douay}</strong>
                </section>
                <section>
                  <span>Modern Catholic</span>
                  <strong>{passage.modern}</strong>
                </section>
              </div>
              <p>{passage.note}</p>
              <small>{passage.sources.join(" / ")}</small>
            </article>
          ))}
        </section>
      </section>
      <section className="trad-section">
        <Header eyebrow="Current Questions" title="Reverence without apology." badge="Charitable and sourced" />
        <section className="library-grid">
          {tradQuestions.map((item) => (
            <article className="info-card source-card" key={item.title}>
              <p className="eyebrow">Trad question</p>
              <h2>{item.title}</h2>
              <strong>{item.stance}</strong>
              <p>{item.body}</p>
              <span>{item.sources.join(" / ")}</span>
            </article>
          ))}
        </section>
      </section>
    </>
  );
}

function getSourceModeDescription(label: (typeof sourceModeLabels)[number]) {
  return {
    "Trad Vault": "Old catechisms, Fathers, Aquinas, papal documents",
    "Bible Compare": "Douay-Rheims, Vulgate, modern translation notes",
    "TLM School": "Learn the 1962 Mass, Latin responses, sacred gestures",
    "Current Questions": "Rails, tongue, ad orientem, veiling, chant"
  }[label];
}

function SavedScreen({
  savedAnswers,
  onOpenAnswer,
  onClear
}: {
  savedAnswers: SavedAnswerRecord[];
  onOpenAnswer: (answer: SavedAnswerRecord) => void;
  onClear: () => void;
}) {
  return (
    <>
      <Header eyebrow="Saved" title="Your reference shelf." badge={`${savedAnswers.length} saved`} />
      {savedAnswers.length ? (
        <>
          <button className="secondary-action page-action" onClick={onClear} type="button">
            Clear local saves
          </button>
          <section className="stack">
            {savedAnswers.map((savedAnswer) => (
              <article className="saved-card" key={savedAnswer.key}>
                <div>
                  <p className="eyebrow">Saved answer</p>
                  <h2>{savedAnswer.title}</h2>
                  <p>{savedAnswer.question}</p>
                </div>
                <button className="primary-action" onClick={() => onOpenAnswer(savedAnswer)} type="button">
                  Open
                </button>
              </article>
            ))}
          </section>
        </>
      ) : (
        <article className="info-card">
          <p className="eyebrow">Empty shelf</p>
          <h2>No saved answers yet.</h2>
          <p>Ask a Catholic question and save the answer to build your personal reference shelf.</p>
        </article>
      )}
    </>
  );
}

function PrayScreen({
  prayedPrayers,
  prayerReminders,
  onOpenPrayer
}: {
  prayedPrayers: Record<string, number>;
  prayerReminders: Record<string, boolean>;
  onOpenPrayer: (prayer: Prayer) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(prayers.map((prayer) => prayer.category)))];
  const filteredPrayers = prayers.filter((prayer) => {
    const haystack = `${prayer.title} ${prayer.body} ${prayer.category}`.toLowerCase();
    return (
      (category === "All" || prayer.category === category) &&
      haystack.includes(query.toLowerCase())
    );
  });

  return (
    <>
      <Header eyebrow="Pray" title="Traditional prayer companion." badge="Latin + English" />
      <article className="rosary-card">
        <p className="eyebrow">Joyful Mysteries</p>
        <h2>The Annunciation</h2>
        <p>Fruit of the mystery: humility. Pray the decade while meditating on Mary's fiat.</p>
        <div className="beads">
          {Array.from({ length: 10 }).map((_, index) => (
            <span className={index < 4 ? "filled" : ""} key={index} />
          ))}
        </div>
        <button className="primary-action" onClick={() => onOpenPrayer(prayers.find((prayer) => prayer.title === "Rosary") || prayers[0])} type="button">
          Open prayer mode
        </button>
      </article>
      <FilterBar
        label="Search prayers"
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        selectedCategory={category}
        onCategoryChange={setCategory}
      />
      <p className="result-count">{filteredPrayers.length} prayer{filteredPrayers.length === 1 ? "" : "s"} found</p>
      {filteredPrayers.length ? (
        <section className="library-grid">
          {filteredPrayers.map((prayer) => (
            <article className="info-card prayer-card" key={prayer.title}>
              <p className="eyebrow">{prayer.category}</p>
              <h2>{prayer.title}</h2>
              <p>{prayer.body}</p>
              <div className="prayer-meta-row">
                <span>{prayedPrayers[prayer.title] ? `${prayedPrayers[prayer.title]} prayed` : "Not prayed yet"}</span>
                {prayerReminders[prayer.title] ? <span>Reminder saved</span> : null}
              </div>
              <button className="secondary-action" onClick={() => onOpenPrayer(prayer)} type="button">
                Open
              </button>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="No prayer found."
          body="Try Rosary, Divine Mercy, Novena, Marian, Daily, or Protection."
          actionLabel="Clear search"
          onAction={() => {
            setQuery("");
            setCategory("All");
          }}
        />
      )}
    </>
  );
}

function CommunityScreen({
  postedIntentions,
  prayedCounts,
  onOpenPost,
  onPrayed
}: {
  postedIntentions: string[];
  prayedCounts: Record<string, number>;
  onOpenPost: () => void;
  onPrayed: (body: string) => void;
}) {
  const visibleIntentions = [
    ...postedIntentions.map((body) => ({ body, prayed: 0 })),
    ...intentions
  ];

  return (
    <>
      <Header eyebrow="Community" title="Prayer-first participation." badge="Moderated" />
      <button className="primary-action page-action" onClick={onOpenPost} type="button">
        Post an intention
      </button>
      <section className="stack">
        {visibleIntentions.map((intention) => (
          <article className="intention-card" key={intention.body}>
            <strong>{intention.body}</strong>
            <span>{intention.prayed + (prayedCounts[intention.body] || 0)} people prayed</span>
            <button onClick={() => onPrayed(intention.body)} type="button">I prayed</button>
          </article>
        ))}
      </section>
    </>
  );
}

function SourceDetail({
  answer,
  composedAnswer,
  retrievedChunks,
  onBack
}: {
  answer: Answer;
  composedAnswer: ComposedAnswer;
  retrievedChunks: RetrievedChunk[];
  onBack: () => void;
}) {
  return (
    <>
      <BackButton onBack={onBack} />
      <Header eyebrow="Source Drawer" title="Every answer shows its receipts." badge="Authority tiers" />
      <article className="answer-card detail-card">
        <p className="eyebrow">Question</p>
        <h2>{answer.question}</h2>
        <p>{composedAnswer.body}</p>
        {composedAnswer.caution ? <p className="pastoral-caution">{composedAnswer.caution}</p> : null}
      </article>
      <section className="citation-grid detail-grid">
        {retrievedChunks.map((chunk) => (
          <article key={chunk.citationLabel}>
            <span>Tier {chunk.authorityTier} / {chunk.sourceType}</span>
            <strong>{chunk.citationLabel}</strong>
            <p>{chunk.chunkText}</p>
          </article>
        ))}
      </section>
    </>
  );
}

function TopicDetail({ topic, onBack }: { topic: Topic; onBack: () => void }) {
  const topicChunks = retrieveChunks(topic.title, 3);

  return (
    <>
      <BackButton onBack={onBack} />
      <Header eyebrow="Topic Detail" title={topic.title} badge={topic.category} />
      <article className="wide-feature topic-detail">
        <img src="/last-supper.jpg" alt="The Last Supper artwork" />
        <div>
          <p className="eyebrow">{topic.label}</p>
          <h2>{topic.title}</h2>
          <p>{topic.body}</p>
        </div>
      </article>
      <section className="library-grid">
        {topicChunks.length ? (
          topicChunks.map((chunk) => (
            <InfoCard
              key={chunk.citationLabel}
              label={`Tier ${chunk.authorityTier}`}
              title={chunk.citationLabel}
              body={chunk.chunkText}
            />
          ))
        ) : (
          <>
            <InfoCard label="1" title="Catechism" body="Primary doctrine references are prioritized for official teaching." />
            <InfoCard label="2" title="Scripture" body="Biblical foundations are connected to each topic." />
            <InfoCard label="3" title="Tradition" body="Fathers, councils, saints, and theological commentary are separated from official teaching." />
          </>
        )}
      </section>
    </>
  );
}

function PrayerDetail({
  prayer,
  prayedCount,
  reminderEnabled,
  sessionPrefs,
  onBack,
  onSessionPrefsChange,
  onMarkPrayed,
  onToggleReminder
}: {
  prayer: Prayer;
  prayedCount: number;
  reminderEnabled: boolean;
  sessionPrefs: PrayerSessionPrefs;
  onBack: () => void;
  onSessionPrefsChange: (prefs: PrayerSessionPrefs) => void;
  onMarkPrayed: () => void;
  onToggleReminder: () => void;
}) {
  const sessionMinutes = { Short: 3, Standard: 7, Deep: 12 }[sessionPrefs.length];

  return (
    <>
      <BackButton onBack={onBack} />
      <Header eyebrow={prayer.category} title={prayer.title} badge="Prayer guide" />
      <article className="rosary-card rosary-detail">
        <p className="eyebrow">Prayer focus</p>
        <h2>{prayer.title}</h2>
        <p>{prayer.body}</p>
        <div className="prayer-status">
          <span>{prayedCount ? `Prayed ${prayedCount} time${prayedCount === 1 ? "" : "s"} on this device` : "Ready to pray"}</span>
          <span>{reminderEnabled ? "Local reminder saved" : "No reminder set"}</span>
        </div>
        <section className="session-panel">
          <div>
            <p className="eyebrow">Session</p>
            <h3>{sessionMinutes} minute {sessionPrefs.guide.toLowerCase()} prayer</h3>
            <p>{sessionPrefs.background ? "Gregorian-style background enabled." : "Quiet mode enabled."}</p>
          </div>
          <div className="segmented-controls">
            {(["Short", "Standard", "Deep"] as const).map((length) => (
              <button
                className={sessionPrefs.length === length ? "active" : ""}
                key={length}
                onClick={() => onSessionPrefsChange({ ...sessionPrefs, length })}
                type="button"
              >
                {length}
              </button>
            ))}
          </div>
          <div className="segmented-controls">
            {(["Silent", "Chanted", "Lectio"] as const).map((guide) => (
              <button
                className={sessionPrefs.guide === guide ? "active" : ""}
                key={guide}
                onClick={() => onSessionPrefsChange({ ...sessionPrefs, guide })}
                type="button"
              >
                {guide}
              </button>
            ))}
          </div>
          <label className="toggle-row">
            <input
              checked={sessionPrefs.background}
              onChange={(event) => onSessionPrefsChange({ ...sessionPrefs, background: event.target.checked })}
              type="checkbox"
            />
            Background chant
          </label>
          <PrayerTimer minutes={sessionMinutes} onComplete={onMarkPrayed} />
        </section>
        <div className="prayer-copy">
          {(prayer.text || "Reviewed full prayer text is not imported yet. This entry is available as a guide and should be completed from approved source material before public release.").split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="source-note">{prayer.sourceNote || "Source review pending."}</p>
        <div className="action-row">
          <button className="primary-action" onClick={onMarkPrayed} type="button">Mark prayed</button>
          <button className="secondary-action" onClick={onToggleReminder} type="button">
            {reminderEnabled ? "Remove reminder" : "Add reminder"}
          </button>
        </div>
      </article>
    </>
  );
}

function PrayerTimer({ minutes, onComplete }: { minutes: number; onComplete: () => void }) {
  const totalSeconds = minutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [completionRecorded, setCompletionRecorded] = useState(false);
  const complete = remaining === 0;

  useEffect(() => {
    setRemaining(totalSeconds);
    setRunning(false);
    setCompletionRecorded(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [remaining, running]);

  useEffect(() => {
    if (!complete || running || completionRecorded) return;
    onComplete();
    setCompletionRecorded(true);
  }, [complete, completionRecorded, onComplete, running]);

  const minutesLeft = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secondsLeft = (remaining % 60).toString().padStart(2, "0");
  const progress = ((totalSeconds - remaining) / totalSeconds) * 100;

  return (
    <section className="timer-card" aria-label="Prayer timer">
      <div>
        <p className="eyebrow">Prayer Timer</p>
        <strong>{minutesLeft}:{secondsLeft}</strong>
      </div>
      <div className="progress-track timer-progress">
        <span style={{ width: `${Math.max(4, progress)}%` }} />
      </div>
      <div className="action-row">
        <button
          className="primary-action"
          disabled={complete}
          onClick={() => setRunning((current) => !current)}
          type="button"
        >
          {complete ? "Completed" : running ? "Pause" : "Start"}
        </button>
        <button
          className="secondary-action"
          onClick={() => {
            setRunning(false);
            setRemaining(totalSeconds);
            setCompletionRecorded(false);
          }}
          type="button"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

function RosaryDetail({ onBack }: { onBack: () => void }) {
  const [bead, setBead] = useState(() => getStored<number>("toc-rosary-bead", 0));
  const [mysterySet, setMysterySet] = useState<MysterySet>(() => getStored<MysterySet>("toc-rosary-mystery", "Joyful"));

  useEffect(() => {
    setStored("toc-rosary-bead", bead);
  }, [bead]);

  useEffect(() => {
    setStored("toc-rosary-mystery", mysterySet);
  }, [mysterySet]);

  const progress = getRosaryProgress(bead, mysterySet);

  return (
    <>
      <BackButton onBack={onBack} />
      <Header eyebrow="Rosary Mode" title={progress.mystery} badge={`${Math.min(bead, 55)} of 55 beads`} />
      <article className="rosary-card rosary-detail">
        <p className="eyebrow">{mysterySet} Mysteries</p>
        <h2>{progress.prayer}</h2>
        <p>{progress.prompt}</p>
        <div className="segmented-controls rosary-set-controls">
          {(Object.keys(rosaryMysteries) as MysterySet[]).map((set) => (
            <button
              className={mysterySet === set ? "active" : ""}
              key={set}
              onClick={() => {
                setMysterySet(set);
                setBead(0);
              }}
              type="button"
            >
              {set}
            </button>
          ))}
        </div>
        <div className="rosary-progress-grid" aria-label="Rosary progress">
          {rosaryMysteries[mysterySet].map((mystery, decadeIndex) => (
            <section key={mystery}>
              <strong>{decadeIndex + 1}. {mystery}</strong>
              <div className="beads">
                {Array.from({ length: 10 }).map((_, index) => {
                  const beadNumber = 6 + decadeIndex * 10 + index;
                  return <span className={bead >= beadNumber ? "filled" : ""} key={index} />;
                })}
              </div>
            </section>
          ))}
        </div>
        <div className="action-row">
          <button className="secondary-action" onClick={() => setBead((current) => Math.max(0, current - 1))} type="button">
            Previous
          </button>
          <button className="primary-action" onClick={() => setBead((current) => (current >= 55 ? 55 : current + 1))} type="button">
            Next bead
          </button>
          <button className="secondary-action" onClick={() => setBead(0)} type="button">
            Reset
          </button>
        </div>
      </article>
    </>
  );
}

function getRosaryProgress(bead: number, mysterySet: MysterySet) {
  if (bead === 0) {
    return {
      mystery: rosaryMysteries[mysterySet][0],
      prayer: "Apostles' Creed",
      prompt: "Begin with the Sign of the Cross and profess the faith before the first Our Father."
    };
  }
  if (bead === 1) {
    return {
      mystery: rosaryMysteries[mysterySet][0],
      prayer: "Our Father",
      prompt: "Pray for the virtues of faith, hope, and charity."
    };
  }
  if (bead >= 2 && bead <= 4) {
    return {
      mystery: rosaryMysteries[mysterySet][0],
      prayer: "Hail Mary",
      prompt: `Opening Hail Mary ${bead - 1} of 3. Ask for deeper faith, hope, and charity.`
    };
  }
  if (bead === 5) {
    return {
      mystery: rosaryMysteries[mysterySet][0],
      prayer: "Glory Be",
      prompt: "Give glory to the Most Holy Trinity before entering the first mystery."
    };
  }

  const decadePosition = Math.min(bead - 6, 49);
  const decadeIndex = Math.floor(decadePosition / 10);
  const beadInDecade = (decadePosition % 10) + 1;
  const mystery = rosaryMysteries[mysterySet][decadeIndex];

  return {
    mystery,
    prayer: "Hail Mary",
    prompt:
      beadInDecade === 1
        ? `Announce and meditate on ${mystery}, pray the Our Father, then begin Hail Mary 1 of 10.`
        : `Hail Mary ${beadInDecade} of 10 for this decade.`
  };
}

function IntentionDetail({
  onBack,
  onPost
}: {
  onBack: () => void;
  onPost: (body: string) => void;
}) {
  const [body, setBody] = useState("For my family to return to the sacraments.");

  return (
    <>
      <BackButton onBack={onBack} />
      <Header eyebrow="Prayer Intention" title="Share a request for prayer." badge="Moderated" />
      <form
        className="post-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (body.trim()) onPost(body.trim());
        }}
      >
        <label htmlFor="intention">Intention</label>
        <textarea id="intention" value={body} onChange={(event) => setBody(event.target.value)} />
        <div className="form-grid">
          <label>
            Visibility
            <select defaultValue="public">
              <option value="public">Public prayer wall</option>
              <option value="group">Parish circle only</option>
              <option value="private">Private</option>
            </select>
          </label>
          <label>
            Group
            <select defaultValue="general">
              <option value="general">General intentions</option>
              <option value="conversion">Family and conversion</option>
              <option value="vocations">Priests and vocations</option>
            </select>
          </label>
        </div>
        <button className="primary-action" type="submit">Post intention</button>
      </form>
    </>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button className="back-button" onClick={onBack} type="button">
      Back
    </button>
  );
}

function InfoCard({
  label,
  title,
  body,
  actionLabel,
  onAction
}: {
  label: string;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <article className="info-card">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      <p>{body}</p>
      {actionLabel && onAction ? (
        <button className="secondary-action" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </article>
  );
}

function EmptyState({
  title,
  body,
  actionLabel,
  onAction
}: {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <article className="empty-state">
      <p className="eyebrow">Nothing here yet</p>
      <h2>{title}</h2>
      <p>{body}</p>
      <button className="secondary-action" onClick={onAction} type="button">
        {actionLabel}
      </button>
    </article>
  );
}

function FilterBar({
  label,
  query,
  onQueryChange,
  categories,
  selectedCategory,
  onCategoryChange
}: {
  label: string;
  query: string;
  onQueryChange: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <section className="filter-bar">
      <label>
        {label}
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search by topic, source, or prayer" />
      </label>
      <div className="category-row">
        {categories.map((category) => (
          <button
            className={selectedCategory === category ? "active" : ""}
            key={category}
            onClick={() => onCategoryChange(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
