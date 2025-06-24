import { compileDirectivesFromMetadata } from "./compile-directives-from-metadata";
import { UserscriptMetadata } from "./interfaces";

describe("compileDirectivesFromMetadata", () => {
  it("returns an empty array when metadata is empty", () => {
    const metadata: Partial<UserscriptMetadata> = {};
    const result = compileDirectivesFromMetadata(metadata);
    expect(result).toEqual([]);
  });

  it("compiles directives for metadata with single values", () => {
    const metadata: Partial<UserscriptMetadata> = {
      name: "Test Script",
      version: "1.0.0",
    };
    const result = compileDirectivesFromMetadata(metadata);
    expect(result).toEqual([
      ["@name", "Test Script"],
      ["@version", "1.0.0"],
    ]);
  });

  it("compiles directives for metadata with array values", () => {
    const metadata: Partial<UserscriptMetadata> = {
      grant: ["GM_getValue", "GM_setValue"],
    };
    const result = compileDirectivesFromMetadata(metadata);
    expect(result).toEqual([
      ["@grant", "GM_getValue"],
      ["@grant", "GM_setValue"],
    ]);
  });

  it("skips directives with undefined values", () => {
    const metadata: Partial<UserscriptMetadata> = {
      name: "Test Script",
      version: undefined,
    };
    const result = compileDirectivesFromMetadata(metadata);
    expect(result).toEqual([["@name", "Test Script"]]);
  });

  it("handles directives with special builders", () => {
    const metadata: Partial<UserscriptMetadata> = {
      antifeatures: {
        tracking: "Tracks user activity",
      },
    };
    const result = compileDirectivesFromMetadata(metadata);
    expect(result).toEqual([
      ["@antifeature", "tracking", "Tracks user activity"],
    ]);
  });

  it("handles directives with no value builders", () => {
    const metadata: Partial<UserscriptMetadata> = {
      noframes: true,
    };
    const result = compileDirectivesFromMetadata(metadata);
    expect(result).toEqual([["@noframes"]]);
  });
});
