import { describe, expect, it } from "vitest";

import { AppError } from "../src/errors";
import { normalizeMessageSpec } from "../src/input/normalize-tree";

describe("normalizeMessageSpec", () => {
  it("normalizes tree spec into flat spec", () => {
    const normalized = normalizeMessageSpec({
      root: {
        type: "Container",
        children: [
          {
            type: "Text",
            props: { text: "hello" }
          }
        ]
      }
    });

    expect(normalized.root).toBe("root");
    expect(Object.keys(normalized.elements)).toHaveLength(2);
    expect(normalized.elements.root.type).toBe("Container");
  });

  it("throws when a flat spec references missing child", () => {
    expect(() =>
      normalizeMessageSpec({
        root: "root",
        elements: {
          root: {
            type: "Container",
            props: {},
            children: ["missing"]
          }
        }
      })
    ).toThrow(AppError);
  });

  it("throws on cyclic flat spec", () => {
    expect(() =>
      normalizeMessageSpec({
        root: "a",
        elements: {
          a: { type: "Container", props: {}, children: ["b"] },
          b: { type: "Container", props: {}, children: ["a"] }
        }
      })
    ).toThrow(AppError);
  });
});
