import { labelPosture, massFlowSections, massFlowSteps } from "./massFlow";

export type AttendMassStep = {
  id: string;
  section: string;
  subsection: string;
  stepTitle: string;
  mainLine: string;
  posture?: string;
  prayerText?: string;
  guidanceText?: string;
  whyThisMatters?: string;
  optional?: boolean;
  conditionalRule?: string;
  sourceProvider?: string;
  textStatus?: string;
  licensingNote?: string;
};

export const attendMassSteps: AttendMassStep[] = massFlowSteps.map((step) => ({
  id: step.id,
  section: step.sectionTitle,
  subsection: step.subtitle ?? step.title,
  stepTitle: step.title,
  mainLine: step.summary,
  posture: labelPosture(step.posture),
  prayerText: step.textBlocks.map((block) => block.text).join("\n\n") || undefined,
  guidanceText: step.guidance,
  optional: step.optional,
  conditionalRule: step.optional ? "Optional where used." : undefined,
  sourceProvider: step.source.sourceProvider,
  textStatus: step.source.textStatus,
  licensingNote: step.source.licensingNote
}));

export const attendSections = massFlowSections.map((section) => section.title) as ["Introductory Rites", "Liturgy of the Word", "Liturgy of the Eucharist", "Concluding Rites"];
