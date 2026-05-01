import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { answers, findAnswer, intentions, prayers, topics, type Answer } from "../src/data/content";
import "./styles.css";

type TabKey = "today" | "ask" | "library" | "pray" | "community";

const tabs: { key: TabKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "ask", label: "Ask" },
  { key: "library", label: "Library" },
  { key: "pray", label: "Pray" },
  { key: "community", label: "Community" }
];

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [question, setQuestion] = useState(answers[0].question);
  const [answer, setAnswer] = useState<Answer>(answers[0]);
  const [saved, setSaved] = useState(false);

  const activeScreen = useMemo(() => {
    if (activeTab === "today") return <TodayScreen />;
    if (activeTab === "ask") {
      return (
        <AskScreen
          answer={answer}
          question={question}
          saved={saved}
          onQuestionChange={setQuestion}
          onSearch={() => {
            setAnswer(findAnswer(question));
            setSaved(false);
          }}
          onSuggested={(nextQuestion) => {
            const nextAnswer = findAnswer(nextQuestion);
            setQuestion(nextAnswer.question);
            setAnswer(nextAnswer);
            setSaved(false);
          }}
          onSave={() => setSaved(true)}
        />
      );
    }
    if (activeTab === "library") return <LibraryScreen />;
    if (activeTab === "pray") return <PrayScreen />;
    return <CommunityScreen />;
  }, [activeTab, answer, question, saved]);

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
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span>V1 Loop</span>
          <p>Learn, ask, cite, pray, participate.</p>
        </div>
      </aside>
      <section className="screen-panel">{activeScreen}</section>
    </main>
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

function TodayScreen() {
  return (
    <>
      <Header eyebrow="Today" title="Ancient faith for ordinary days." badge="Source-grounded" />
      <section className="today-layout">
        <article className="image-feature">
          <img src="/disputa.jpg" alt="Disputation of the Holy Sacrament artwork" />
          <div>
            <p className="eyebrow">Saint & Feast</p>
            <h2>St. Catherine of Siena</h2>
            <p>Doctor of the Church and witness to reform, prayer, and courageous charity.</p>
          </div>
        </article>
        <div className="stack">
          <InfoCard label="Daily Teaching" title="The Eucharist is the source and summit." body="Linked path: Catechism, Vatican II, Trent, Aquinas, and devotional practice." />
          <InfoCard label="Prayer" title="Regina Caeli" body="Seasonal Marian prayer with English and Latin options." />
        </div>
      </section>
    </>
  );
}

function AskScreen({
  answer,
  question,
  saved,
  onQuestionChange,
  onSearch,
  onSuggested,
  onSave
}: {
  answer: Answer;
  question: string;
  saved: boolean;
  onQuestionChange: (question: string) => void;
  onSearch: () => void;
  onSuggested: (question: string) => void;
  onSave: () => void;
}) {
  return (
    <>
      <Header eyebrow="Ask" title="Search Catholic teaching." badge="Citations required" />
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
        {answers.map((item) => (
          <button key={item.key} onClick={() => onSuggested(item.question)} type="button">
            {item.key}
          </button>
        ))}
      </div>
      <article className="answer-card">
        <p className="eyebrow">{answer.sourceType}</p>
        <h2>{answer.title}</h2>
        <p>{answer.answer}</p>
        <div className="citation-grid">
          {answer.citations.map((citation) => (
            <article key={citation.title}>
              <span>Tier {citation.authorityTier} / {citation.type}</span>
              <strong>{citation.title}</strong>
              <p>{citation.note}</p>
            </article>
          ))}
        </div>
        <button className="primary-action" onClick={onSave} type="button">
          {saved ? "Saved to library" : "Save topic"}
        </button>
      </article>
    </>
  );
}

function LibraryScreen() {
  return (
    <>
      <Header eyebrow="Library" title="Curated Catholic sources." badge="Tiered sources" />
      <section className="library-grid">
        {topics.map((topic) => (
          <InfoCard key={topic.title} label={topic.label} title={topic.title} body={topic.body} />
        ))}
      </section>
      <article className="wide-feature">
        <img src="/last-supper.jpg" alt="The Last Supper artwork" />
        <div>
          <p className="eyebrow">Topic Detail</p>
          <h2>The Eucharist</h2>
          <p>Catechism, Scripture, councils, saints, common questions, and devotional practice.</p>
        </div>
      </article>
    </>
  );
}

function PrayScreen() {
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
      </article>
      <section className="library-grid">
        {prayers.map((prayer) => (
          <InfoCard key={prayer} label="Prayer" title={prayer} body="Guide, reminder, and source note." />
        ))}
      </section>
    </>
  );
}

function CommunityScreen() {
  return (
    <>
      <Header eyebrow="Community" title="Prayer-first participation." badge="Moderated" />
      <section className="stack">
        {intentions.map((intention) => (
          <article className="intention-card" key={intention.body}>
            <strong>{intention.body}</strong>
            <span>{intention.prayed} people prayed</span>
            <button type="button">I prayed</button>
          </article>
        ))}
      </section>
    </>
  );
}

function InfoCard({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <article className="info-card">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </article>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
