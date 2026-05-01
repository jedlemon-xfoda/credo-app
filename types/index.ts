export type OnboardingChoice = "prepare" | "understand" | "returning" | "exploring";

export type SundayState = "beforeMass" | "duringMass" | "afterMass" | "weekday";

export type MassWindow = {
  day?: number;
  startHour: number;
  endHour: number;
};

export type SundayMode = "prepare" | "attend" | "reflect";

export type JourneyStepStatus = "not_started" | "in_progress" | "complete";

export type JourneyStepId = "prepare" | "attend" | "reflect";

export type ExperienceMode = "quiet" | "guided" | "not_sure";

export type MassTypePreference = "sunday" | "daily" | "both" | "not_sure";

export type FamiliarityLevel = "new" | "somewhat" | "very" | "not_sure";

export type ParishStyle = "traditional" | "balanced" | "modern" | "not_sure";

export type DailyJourneyState = {
  date: string;
  steps: Record<JourneyStepId, JourneyStepStatus>;
  currentStep: JourneyStepId;
  attendPosition?: string;
  prepareStep?: number;
  completedAt?: Partial<Record<JourneyStepId, string>>;
};

export type UserMassProfile = {
  experienceMode: ExperienceMode;
  familiarity: FamiliarityLevel;
  massTypePreference: MassTypePreference;
  parishStyle: ParishStyle;
};

export type ContentTextStatus = "placeholder" | "review_only" | "licensed" | "public_domain" | "user_configured";

export type ContentSourceProvider = "mock" | "usccb" | "evangelizo" | "universalis" | "manual_review";

export type ContentMetadata = {
  sourceProvider: ContentSourceProvider;
  textStatus: ContentTextStatus;
  licensingNote: string;
  canonicalSourceUrl?: string;
  lastUpdated?: string;
};

export type MassTextRole = "celebrant" | "deacon" | "reader" | "cantor" | "you" | "all";

export type MassPosture = "stand" | "sit" | "kneel" | "stand_or_kneel" | "sit_or_stand" | "process";

export type MassSourceMetadata = ContentMetadata;

export type ListenAnchor = {
  id: string;
  phrase: string;
  confidenceHint?: "low" | "medium" | "high";
};

export type MassTextBlock = {
  id: string;
  role: MassTextRole;
  text: string;
  source?: MassSourceMetadata;
};

export type MassFlowStep = {
  id: string;
  sectionId: string;
  sectionTitle: string;
  title: string;
  subtitle?: string;
  summary: string;
  posture?: MassPosture;
  optional?: boolean;
  textBlocks: MassTextBlock[];
  guidance?: string;
  source: MassSourceMetadata;
  listenAnchors: ListenAnchor[];
  profileFlags?: {
    parishStyle?: ParishStyle[];
    massTypePreference?: MassTypePreference[];
    celebrantVariantReady?: boolean;
    localCustomizable?: boolean;
  };
};

export type MassFlowSection = {
  id: string;
  title: string;
  summary: string;
  steps: MassFlowStep[];
  source: MassSourceMetadata;
};

export type Reading = {
  label: string;
  citation: string;
  summary: string;
};

export type NoticeItem = {
  title: string;
  body: string;
};

export type SundayContent = {
  title: string;
  date: string;
  weeklyTruth: string;
  practice: string;
  familyQuestion: string;
  readings: Reading[];
  notice: NoticeItem[];
};

export type TextStatus = "original-app-copy" | "placeholder-license-pending" | "reference-metadata-only" | "licensed-pending-verification";

export type MassSection = {
  id: string;
  jumpLabel?: string;
  title: string;
  category?: "beginning" | "readings" | "homily" | "creed" | "offertory" | "eucharisticPrayer" | "communion" | "ending";
  sourceProvider: string;
  textStatus: TextStatus;
  licensingNote?: string;
  main: string;
  detail: string;
  whatIsHappening?: string;
  responseText?: string;
  quietText?: string;
  postureCue?: string;
  shortMeaning?: string;
  source?: {
    label: string;
    citation: string;
    url?: string;
    licensingNote?: string;
  };
  nextSectionIds?: string[];
  what?: string;
  why?: string;
  how?: string;
  sourceRefs?: SourceReference[];
};

export type SourceReference = {
  label: string;
  citation: string;
  note: string;
  url: string;
};

export type Reflection = {
  id: string;
  date: string;
  sundayTitle: string;
  text: string;
  tags: string[];
  source?: "reflect" | "promptChip" | "savedMass";
};

export type SavedMassItem = {
  sectionId: string;
  title: string;
  meaning: string;
  timestamp: string;
};
