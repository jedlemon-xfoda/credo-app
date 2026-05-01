import { EvangelizoProvider, MockProvider, USCCBProvider, UniversalisProvider, liturgicalProviders } from "../data/liturgicalProviders";

describe("liturgical providers", () => {
  it("MockProvider returns local Mass companion sections", () => {
    const sections = MockProvider.getMassCompanionSections();

    expect(sections.length).toBeGreaterThan(0);
    expect(sections[0].id).toBe("beginning");
    expect(sections[0].sourceProvider).toBe("mock");
    expect(sections[0].textStatus).toBe("placeholder-license-pending");
    expect(sections[0].responseText).toContain("We ask the Lord for mercy.");

    sections.forEach((section) => {
      expect(section.sourceProvider).toBeTruthy();
      expect(section.textStatus).toBeTruthy();
      expect(section.licensingNote).toBeTruthy();
    });
  });

  it("USCCBProvider prototype adapter uses local data until licensed integration is ready", () => {
    const sections = USCCBProvider.getMassCompanionSections({ calendar: "ordinaryForm" });

    expect(USCCBProvider.id).toBe("usccb");
    expect(sections.some((section) => section.id === "readings")).toBe(true);
  });

  it("UniversalisProvider is present as a stub without changing v1 features", () => {
    expect(liturgicalProviders.universalis).toBe(UniversalisProvider);
    expect(UniversalisProvider.getMassCompanionSections()).toEqual(MockProvider.getMassCompanionSections());
  });

  it("EvangelizoProvider is present as a stub without changing v1 features", () => {
    expect(liturgicalProviders.evangelizo).toBe(EvangelizoProvider);
    expect(EvangelizoProvider.getMassCompanionSections()).toEqual(MockProvider.getMassCompanionSections());
  });
});
