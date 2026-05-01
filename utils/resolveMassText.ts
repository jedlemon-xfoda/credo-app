import type { MassTextBlock } from "../types";

export type MassContentMap = Record<string, string>;

export function resolveMassTextBlock(
  block: MassTextBlock,
  content: MassContentMap
): MassTextBlock {
  if (!block.contentKey) {
    return block;
  }

  return {
    ...block,
    text: content[block.contentKey] ?? block.text,
  };
}