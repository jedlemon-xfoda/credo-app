import type { ContentMetadata } from "../types";

export type LiturgicalColor = "White" | "Red" | "Green" | "Violet" | "Rose" | "Black" | "Gold";

export type MassMeta = {
  title: string;
  season: string;
  liturgicalColor: LiturgicalColor;
  massType: string;
  metadata: ContentMetadata;
};

export type DailyReadingItem = {
  id: string;
  title: string;
  citation: string;
  text: string;
  excerpt: string;
  metadata: ContentMetadata;
};

export type DailyReadings = {
  date: string;
  items: DailyReadingItem[];
  metadata: ContentMetadata;
};

export type AttendStepContent = {
  id: string;
  mainLine?: string;
  posture?: string;
  prayerText?: string;
  guidanceText?: string;
  optionalNote?: string;
  metadata: ContentMetadata;
};

export type AttendContent = {
  steps: Record<string, AttendStepContent>;
  metadata: ContentMetadata;
};

export type LearnReferenceGroup = {
  scripture: string[];
  catechism: string[];
  fathersAndCouncils: string[];
};

export type LearnSectionContent = {
  id: string;
  section: string;
  title: string;
  summary: string;
  what: string;
  why: string;
  how: string;
  parts: string[];
  diveDeeper: LearnReferenceGroup;
  metadata: ContentMetadata;
};

export type LearnContent = {
  sections: LearnSectionContent[];
  metadata: ContentMetadata;
};

export type LiturgicalContentProvider = {
  getTodayMassMeta(date: Date): Promise<MassMeta>;
  getReadingsForDate(date: Date): Promise<DailyReadings>;
  getAttendContent(date: Date): Promise<AttendContent>;
  getLearnContent(): Promise<LearnContent>;
  getContentMetadata(): Promise<ContentMetadata>;
};
