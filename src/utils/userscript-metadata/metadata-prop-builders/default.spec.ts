import buildDefaultMetadataProp from "./default";
import { URLWithIntegrity } from "../interfaces";

describe("buildDefaultMetadataProp", () => {
  it("returns correct metadata for string value", () => {
    const result = buildDefaultMetadataProp("name", "value");
    expect(result).toEqual([["@name", "value"]]);
  });

  it("returns correct metadata for array value", () => {
    const result = buildDefaultMetadataProp("name", ["value1", "value2"]);
    expect(result).toEqual([
      ["@name", "value1"],
      ["@name", "value2"],
    ]);
  });

  it("returns correct metadata for LocalizableValue with DEFAULT", () => {
    const result = buildDefaultMetadataProp("name", {
      DEFAULT: "defaultValue",
      en: "englishValue",
      fr: "frenchValue",
    });
    expect(result).toEqual([
      ["@name", "defaultValue"],
      ["@name:en", "englishValue"],
      ["@name:fr", "frenchValue"],
    ]);
  });

  it("throws an error for unsupported value type", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing runtime error handling
    expect(() => buildDefaultMetadataProp("name", 123 as any)).toThrow(
      'Unsupported value type for metadata property "name": number',
    );
  });

  it("handles LocalizableValue without DEFAULT", () => {
    const result = buildDefaultMetadataProp("name", {
      en: "englishValue",
      fr: "frenchValue",
    });
    expect(result).toEqual([
      ["@name:en", "englishValue"],
      ["@name:fr", "frenchValue"],
    ]);
  });

  it("handles RegExp value", () => {
    expect(buildDefaultMetadataProp("name", /test/)).toEqual([
      ["@name", "/test/"],
    ]);
    expect(buildDefaultMetadataProp("name", [/test1/, /test2/])).toEqual([
      ["@name", "/test1/"],
      ["@name", "/test2/"],
    ]);
  });

  it("handles mixed RegExp and string values", () => {
    expect(buildDefaultMetadataProp("name", ["test", /testRegExp/])).toEqual([
      ["@name", "test"],
      ["@name", "/testRegExp/"],
    ]);
  });

  it("handles URLWithIntegrity", () => {
    const urlWithIntegrity: URLWithIntegrity = {
      url: "https://example.com/script.js",
      integrity: {
        sha256: "abc123",
      },
    };
    const result = buildDefaultMetadataProp("name", urlWithIntegrity);
    expect(result).toEqual([
      ["@name", "https://example.com/script.js#sha256=abc123"],
    ]);
  });
});
