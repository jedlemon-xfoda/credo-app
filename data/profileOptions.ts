import type { ExperienceMode, FamiliarityLevel, MassTypePreference, ParishStyle, UserMassProfile } from "../types";

export type ProfileField = keyof UserMassProfile;

export type ProfileOption = {
  id: string;
  value: ExperienceMode | FamiliarityLevel | MassTypePreference | ParishStyle;
  title: string;
  subtitle: string;
  icon: string;
};

export const profileOptionGroups: Record<ProfileField, { title: string; options: ProfileOption[] }> = {
  experienceMode: {
    title: "Experience Mode",
    options: [
      { id: "guided", value: "guided", title: "Guided", subtitle: "Gentle guidance.", icon: "+" },
      { id: "quiet", value: "quiet", title: "Quiet", subtitle: "Simple and prayerful.", icon: "*" },
      { id: "not_sure", value: "not_sure", title: "Not sure", subtitle: "We'll guide you.", icon: "?" }
    ]
  },
  familiarity: {
    title: "Familiarity",
    options: [
      { id: "new", value: "new", title: "New to Mass", subtitle: "I need the basics.", icon: "+" },
      { id: "somewhat", value: "somewhat", title: "Somewhat familiar", subtitle: "I know some parts.", icon: "o" },
      { id: "very", value: "very", title: "Very familiar", subtitle: "Keep it concise.", icon: "*" },
      { id: "not-sure", value: "not_sure", title: "Not sure yet", subtitle: "Help me find my footing.", icon: "?" }
    ]
  },
  massTypePreference: {
    title: "Mass Type",
    options: [
      { id: "sunday", value: "sunday", title: "Sunday Mass", subtitle: "The Lord's Day.", icon: "+" },
      { id: "daily", value: "daily", title: "Daily Mass", subtitle: "A quieter rhythm.", icon: "o" },
      { id: "both", value: "both", title: "Both", subtitle: "Sunday and weekday.", icon: "*" },
      { id: "not-sure", value: "not_sure", title: "Not sure yet", subtitle: "I'll decide later.", icon: "?" }
    ]
  },
  parishStyle: {
    title: "Parish Style",
    options: [
      { id: "traditional", value: "traditional", title: "Traditional", subtitle: "More solemn and classic.", icon: "+" },
      { id: "balanced", value: "balanced", title: "Balanced", subtitle: "A clear middle path.", icon: "o" },
      { id: "modern", value: "modern", title: "Modern", subtitle: "Simple and contemporary.", icon: "*" },
      { id: "not-sure", value: "not_sure", title: "Not sure yet", subtitle: "Use a balanced default.", icon: "?" }
    ]
  }
};
