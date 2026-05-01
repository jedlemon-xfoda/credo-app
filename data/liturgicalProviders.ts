import type { MassSection } from "../types";
import { prayersAndResponses } from "./prayersAndResponses";

export type LiturgicalProviderId = "mock" | "usccb" | "universalis" | "evangelizo";

export type LiturgicalProviderContext = {
  date?: Date;
  locale?: string;
  calendar?: "ordinaryForm";
};

export type LiturgicalProvider = {
  id: LiturgicalProviderId;
  name: string;
  getMassCompanionSections: (context?: LiturgicalProviderContext) => MassSection[];
};

export const MockProvider: LiturgicalProvider = {
  id: "mock",
  name: "Local Mass Companion Mock Provider",
  getMassCompanionSections: () => prayersAndResponses
};

export const USCCBProvider: LiturgicalProvider = {
  id: "usccb",
  name: "USCCB Provider Prototype",
  getMassCompanionSections: () => {
    // TODO: Replace with a licensed/local adapter for USCCB readings metadata when provider terms are confirmed.
    return prayersAndResponses;
  }
};

export const UniversalisProvider: LiturgicalProvider = {
  id: "universalis",
  name: "Universalis Provider Stub",
  getMassCompanionSections: () => {
    // TODO: Implement only after licensing, territory, and API/data access are confirmed.
    return prayersAndResponses;
  }
};

export const EvangelizoProvider: LiturgicalProvider = {
  id: "evangelizo",
  name: "Evangelizo Provider Stub",
  getMassCompanionSections: () => {
    // TODO: Implement only after source permissions, attribution requirements, and API/data access are confirmed.
    return prayersAndResponses;
  }
};

export const liturgicalProviders = {
  mock: MockProvider,
  usccb: USCCBProvider,
  universalis: UniversalisProvider,
  evangelizo: EvangelizoProvider
} satisfies Record<LiturgicalProviderId, LiturgicalProvider>;
