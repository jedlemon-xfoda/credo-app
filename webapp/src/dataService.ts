import { supabase } from "./supabaseClient";

export type SavedAnswerRecord = {
  key: string;
  question: string;
  title: string;
};

const keys = {
  savedAnswers: "toc-saved-answers",
  postedIntentions: "toc-posted-intentions",
  prayedCounts: "toc-prayed-counts",
  prayedPrayers: "toc-prayed-prayers",
  prayerReminders: "toc-prayer-reminders",
  challengeProgress: "toc-challenge-progress",
  prayerSessionPrefs: "toc-prayer-session-prefs",
  preferences: "toc-preferences",
  activeTab: "toc-active-tab",
  onboarded: "toc-onboarded"
};

export function getStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setStored<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function loadSavedAnswers(): Promise<SavedAnswerRecord[]> {
  if (!supabase) return getStored<SavedAnswerRecord[]>(keys.savedAnswers, []);

  const { data, error } = await supabase
    .from("saved_answers")
    .select("question_text, answer_text, citations")
    .order("created_at", { ascending: false });

  if (error || !data) return getStored<SavedAnswerRecord[]>(keys.savedAnswers, []);

  return data.map((row, index) => ({
    key: `remote-${index}-${row.question_text}`,
    question: row.question_text,
    title: row.answer_text.slice(0, 120)
  }));
}

export async function getCurrentUserEmail(): Promise<string | null> {
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user?.email ?? null;
}

export async function signInWithEmail(email: string) {
  if (!supabase) return { ok: false, message: "Supabase is not configured yet. Local mode is active." };

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin
    }
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Check your email for a sign-in link." };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function saveAnswer(record: SavedAnswerRecord, answerText: string, citations: unknown[]) {
  const current = getStored<SavedAnswerRecord[]>(keys.savedAnswers, []);
  if (!current.some((item) => item.key === record.key)) {
    setStored(keys.savedAnswers, [record, ...current]);
  }

  if (!supabase) return;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("saved_answers").insert({
    user_id: user.id,
    question_text: record.question,
    answer_text: answerText,
    citations
  });
}

export async function postIntention(body: string) {
  const current = getStored<string[]>(keys.postedIntentions, []);
  setStored(keys.postedIntentions, [body, ...current]);

  if (!supabase) return;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("prayer_intentions").insert({
    user_id: user.id,
    body,
    visibility: "public",
    status: "pending"
  });
}

export { keys };
