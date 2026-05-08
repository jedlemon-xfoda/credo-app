import type { MassFlowStep, MassGuidedItem } from "../types";
import { massFlowBranchGroups, massResponseLanguageOptions } from "./massFlow";

export type RuntimeGuidedPage = {
  artItem?: MassGuidedItem;
  description?: string;
  id: string;
  items: MassGuidedItem[];
};

export type VariantGroupId =
  | "greeting"
  | "penitential-act"
  | "creed"
  | "eucharistic-prayer"
  | "dismissal"
  | "blessing"
  | "gospel-acclamation"
  | "standalone-kyrie";

export type VariantOption = {
  branchId?: string;
  id: string;
  label: string;
  responseText?: string;
};

export type VariantRule = {
  groupId: VariantGroupId;
  options: VariantOption[];
  title: string;
};

export type GestureKind =
  | "sign_of_cross"
  | "breast_strike"
  | "triple_gospel_cross"
  | "bow"
  | "elevation_host"
  | "elevation_chalice"
  | "procession";

export type GestureMetadata = {
  assetKey: string;
  cadenceLabel?: string;
  fallbackShape: "cross" | "hand" | "host" | "chalice" | "procession";
  kind: GestureKind;
};

export type AmbientPolicy = "required" | "optional" | "suppress_by_default" | "none";

export type GuidedPagePolicy = {
  ambientPolicy: AmbientPolicy;
  gesture?: GestureMetadata;
  showFullPrayer: boolean;
  variantGroup?: VariantRule;
};

const substantialPrayerKeys = new Set([
  "apostles_creed",
  "confiteor",
  "eucharistic_prayer_i",
  "eucharistic_prayer_ii",
  "eucharistic_prayer_iii",
  "eucharistic_prayer_iv",
  "gloria",
  "holy",
  "kyrie",
  "lamb_of_god",
  "lords_prayer",
  "mystery_of_faith",
  "nicene_creed",
  "penitential_dialogue",
  "penitential_tropes",
  "response_for_the_kingdom",
  "response_lord_not_worthy",
  "response_may_the_lord_accept",
  "solemn_blessing",
  "sprinkling_rite"
]);

const shortResponseKeys = new Set([
  "response_alleluia",
  "response_amen",
  "response_and_with_your_spirit",
  "response_blessed_be_god_forever",
  "response_easter_dismissal_alleluia",
  "response_glory_to_you",
  "response_great_amen",
  "response_lent_gospel_acclamation",
  "response_lord_hear_our_prayer",
  "response_praise_to_you",
  "response_right_and_just",
  "response_thanks_be_to_god",
  "response_we_lift_them_up"
]);

const suppressAmbientIds = new Set(["gloria-ambient"]);
const optionalAmbientIds = new Set(["announcements-listen", "communion-thanksgiving"]);
const requiredAmbientIds = new Set([
  "branch-ep-i-chalice-elevation",
  "branch-ep-i-host-elevation",
  "branch-ep-ii-chalice-elevation",
  "branch-ep-ii-host-elevation",
  "branch-ep-iii-chalice-elevation",
  "branch-ep-iii-host-elevation",
  "branch-ep-iv-chalice-elevation",
  "branch-ep-iv-host-elevation",
  "branch-sprinkling-ambient",
  "communion-process",
  "consecration-chalice-elevation",
  "consecration-host-elevation",
  "entrance-ambient",
  "entrance-listen",
  "lamb-fraction",
  "presentation-gifts"
]);

export function shouldShowFullPrayerAction(step: MassFlowStep, page: RuntimeGuidedPage): boolean {
  const itemsWithKeys = page.items.filter((item) => Boolean(item.fullPrayerKey));
  if (itemsWithKeys.length === 0) {
    return false;
  }

  if (isPostureOnlyPage(page) || isAmbientOnlyPage(page)) {
    return false;
  }

  return itemsWithKeys.some((item) => {
    const key = item.fullPrayerKey;
    if (!key || shortResponseKeys.has(key)) {
      return false;
    }
    return substantialPrayerKeys.has(key) || isStepPrayerKey(step, key);
  });
}

export function getVariantRuleForPage(step: MassFlowStep, page: RuntimeGuidedPage): VariantRule | undefined {
  const itemIds = page.items.map((item) => item.id);

  if (step.id === "greeting" && itemIds.includes("greeting-response")) {
    return {
      groupId: "greeting",
      title: "Which response are you hearing?",
      options: [
        {
          id: "greeting-english",
          label: massResponseLanguageOptions.response_and_with_your_spirit.english,
          responseText: massResponseLanguageOptions.response_and_with_your_spirit.english
        },
        {
          id: "greeting-latin",
          label: massResponseLanguageOptions.response_and_with_your_spirit.latin,
          responseText: massResponseLanguageOptions.response_and_with_your_spirit.latin
        }
      ]
    };
  }

  if (
    step.id === "penitential-act" &&
    itemIds.some((id) => id === "confiteor-1" || id === "branch-confiteor-prayer" || id === "branch-dialogue-have-mercy" || id === "branch-tropes-contrite")
  ) {
    return penitentialVariantRule();
  }

  if (step.id === "penitential-act" && itemIds.some((id) => id === "kyrie-lord-1-listen" || id === "branch-kyrie-english-lord-1-listen" || id === "branch-kyrie-greek-lord-1-listen")) {
    return standaloneKyrieVariantRule();
  }

  if (step.id === "gospel-acclamation" && itemIds.some((id) => id.includes("gospel-acclamation"))) {
    return branchVariantRule("gospel-acclamation", "Gospel Acclamation form", ["gospel_acclamation"]);
  }

  if (step.id === "profession-of-faith" && itemIds.some((id) => id === "creed-begin" || id.startsWith("branch-nicene-") || id.startsWith("branch-apostles-"))) {
    return branchVariantRule("creed", "Creed form", ["creed"]);
  }

  if (step.id === "preface" && itemIds.includes("preface-prayer")) {
    return branchVariantRule("eucharistic-prayer", "Eucharistic Prayer", ["eucharistic_prayer"]);
  }

  if (step.id === "blessing" && itemIds.some((id) => id === "blessing-dialogue-listen" || id === "blessing-cross")) {
    return branchVariantRule("blessing", "Blessing form", ["blessing"]);
  }

  if (step.id === "dismissal" && itemIds.some((id) => id === "dismissal-listen" || id === "dismissal-response")) {
    return branchVariantRule("dismissal", "Dismissal form", ["dismissal"]);
  }

  return undefined;
}

export function getGestureForPage(step: MassFlowStep, page: RuntimeGuidedPage): GestureMetadata | undefined {
  const item = page.artItem ?? page.items[0];
  const searchable = [step.id, page.id, ...page.items.map((candidate) => `${candidate.id} ${candidate.text} ${candidate.cadenceCue ?? ""}`)]
    .join(" ")
    .toLowerCase();

  if (searchable.includes("sign-cross") || searchable.includes("sign of the cross")) {
    return gesture("sign_of_cross", "gesture.sign_of_cross", "cross", "Sign of the Cross");
  }

  if (searchable.includes("most grievous fault")) {
    return gesture("breast_strike", "gesture.breast_strike.small", "hand", "Strike breast");
  }

  if (searchable.includes("strike breast") || searchable.includes("fault")) {
    return gesture("breast_strike", "gesture.breast_strike.large", "hand", "Strike breast");
  }

  if (searchable.includes("forehead, lips, heart") || searchable.includes("small cross")) {
    return gesture("triple_gospel_cross", "gesture.triple_gospel_cross", "cross", "Forehead, lips, heart");
  }

  if (searchable.includes("bow")) {
    return gesture("bow", "gesture.bow", "hand", "Bow");
  }

  if (searchable.includes("host-elevation") || searchable.includes("sacred host") || item?.id.includes("host-elevation")) {
    return gesture("elevation_host", "gesture.elevation_host", "host", "Elevation of the Host");
  }

  if (searchable.includes("chalice-elevation") || searchable.includes("precious blood") || item?.id.includes("chalice-elevation")) {
    return gesture("elevation_chalice", "gesture.elevation_chalice", "chalice", "Elevation of the Chalice");
  }

  if (page.items.some((candidate) => candidate.posture === "process") || searchable.includes("procession") || searchable.includes("process to the altar")) {
    return gesture("procession", "gesture.procession", "procession", "Procession");
  }

  return undefined;
}

export function getAmbientPolicy(_step: MassFlowStep, page: RuntimeGuidedPage): AmbientPolicy {
  if (page.items.some((item) => suppressAmbientIds.has(item.id))) {
    return "suppress_by_default";
  }

  if (page.items.some((item) => optionalAmbientIds.has(item.id))) {
    return "optional";
  }

  if (page.items.some((item) => requiredAmbientIds.has(item.id) || item.guidanceType === "ambient")) {
    return "required";
  }

  return "none";
}

export function getGuidedPagePolicy(step: MassFlowStep, page: RuntimeGuidedPage): GuidedPagePolicy {
  return {
    ambientPolicy: getAmbientPolicy(step, page),
    gesture: getGestureForPage(step, page),
    showFullPrayer: shouldShowFullPrayerAction(step, page),
    variantGroup: getVariantRuleForPage(step, page)
  };
}

function branchVariantRule(groupId: VariantGroupId, title: string, kinds: Array<(typeof massFlowBranchGroups)[number]["kind"]>): VariantRule | undefined {
  const options = massFlowBranchGroups
    .filter((branch) => kinds.includes(branch.kind))
    .map((branch) => ({
      branchId: branch.id,
      id: branch.id,
      label: branch.title
    }));

  if (options.length === 0) {
    return undefined;
  }

  return { groupId, options, title };
}

function penitentialVariantRule(): VariantRule | undefined {
const heardLabels: Record<string, string> = {
    "penitential-confiteor": "I confess to almighty God...",
    "penitential-dialogue": "Have mercy on us, O Lord.",
    "penitential-tropes": "You were sent to heal the contrite of heart..."
  };

  const options = massFlowBranchGroups
    .filter((branch) => branch.kind === "penitential_act")
    .map((branch) => ({
      branchId: branch.id,
      id: branch.id,
      label: heardLabels[branch.id] ?? branch.title
    }));

  if (options.length === 0) {
    return undefined;
  }

  return { groupId: "penitential-act", options, title: "Which form are you hearing?" };
}

function standaloneKyrieVariantRule(): VariantRule {
  return {
    groupId: "standalone-kyrie",
    title: "Which Kyrie are you hearing?",
    options: [
      {
        branchId: "standalone-kyrie-english",
        id: "standalone-kyrie-english",
        label: "Lord, have mercy."
      },
      {
        branchId: "standalone-kyrie-greek-latin",
        id: "standalone-kyrie-greek-latin",
        label: "Kyrie, eleison."
      }
    ]
  };
}

function gesture(kind: GestureKind, assetKey: string, fallbackShape: GestureMetadata["fallbackShape"], cadenceLabel: string): GestureMetadata {
  return { assetKey, cadenceLabel, fallbackShape, kind };
}

function isPostureOnlyPage(page: RuntimeGuidedPage): boolean {
  return page.items.every((item) => item.guidanceType === "you_do" && !item.fullPrayerKey);
}

function isAmbientOnlyPage(page: RuntimeGuidedPage): boolean {
  return page.items.every((item) => item.guidanceType === "ambient" && !item.fullPrayerKey);
}

function isStepPrayerKey(step: MassFlowStep, key: string): boolean {
  return step.textBlocks.some((block) => block.contentKey === key);
}
