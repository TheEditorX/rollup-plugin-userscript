import buildAntiFeatures from "./antifeature";

describe("buildAntiFeatures", () => {
  it("returns correct structure for string descriptions", () => {
    const antiFeatures = {
      tracking: "Tracks user activity",
    };

    const result = buildAntiFeatures(antiFeatures);

    expect(result).toEqual([
      ["@antifeature", "tracking", "Tracks user activity"],
    ]);
  });

  it("returns correct structure for localized descriptions", () => {
    const antiFeatures = {
      ads: {
        en: "Displays ads",
        fr: "Affiche des publicités",
      },
    };

    const result = buildAntiFeatures(antiFeatures);

    expect(result).toEqual([
      ["@antifeature:en", "ads", "Displays ads"],
      ["@antifeature:fr", "ads", "Affiche des publicités"],
    ]);
  });

  it("handles empty antiFeatures object", () => {
    const antiFeatures = {};

    const result = buildAntiFeatures(antiFeatures);

    expect(result).toEqual([]);
  });

  it("handles null or undefined values gracefully", () => {
    const antiFeatures = {
      tracking: null,
    };

    expect(buildAntiFeatures(antiFeatures)).toEqual([])
  });
});
