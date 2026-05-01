import { resolveMassTextBlock } from "./resolveMassText";
import type { MassTextBlock } from "../types";

const baseBlock: MassTextBlock = {
  id: "greeting",
  role: "celebrant",
  text: "Static fallback text",
};

describe("resolveMassTextBlock", () => {
  it("returns the original block when no contentKey exists", () => {
    const result = resolveMassTextBlock(baseBlock, {
      greeting: "Dynamic text",
    });

    expect(result).toEqual(baseBlock);
  });

  it("injects dynamic text when contentKey exists and content is found", () => {
    const block: MassTextBlock = {
      ...baseBlock,
      contentKey: "greeting",
    };

    const result = resolveMassTextBlock(block, {
      greeting: "Dynamic text",
    });

    expect(result.text).toBe("Dynamic text");
    expect(result.contentKey).toBe("greeting");
  });

  it("falls back to static text when contentKey is missing from content map", () => {
    const block: MassTextBlock = {
      ...baseBlock,
      contentKey: "missing_key",
    };

    const result = resolveMassTextBlock(block, {});

    expect(result.text).toBe("Static fallback text");
  });
});