import { LocalizableValue, UserscriptMetadata } from "../interfaces";

const DIRECTIVE_TOKEN = "@antifeature";

function buildAntiFeature(
  type: keyof UserscriptMetadata["antifeatures"],
  value: string | LocalizableValue,
): string[][] {
  if (typeof value === "string") return [[DIRECTIVE_TOKEN, type, value]];

  return Object.entries(value).map(([lang, localizedValue]) => [
    lang === "DEFAULT" ? DIRECTIVE_TOKEN : `${DIRECTIVE_TOKEN}:${lang}`,
    type,
    localizedValue ?? "",
  ]);
}

export default function buildAntiFeatures(
  antiFeatures: UserscriptMetadata["antifeatures"],
): string[][] {
  const directiveToken = "@antifeature";

  const result: string[][] = [];

  for (const [tag, description] of Object.entries(antiFeatures)) {
    if (!description) continue;

    if (typeof description === "string") {
      result.push([directiveToken, tag, description]);
    } else if (typeof description === "object") {
      const entries = buildAntiFeature(
        tag as keyof UserscriptMetadata["antifeatures"],
        description,
      );
      result.push(...entries);
    } else {
      throw new Error(
        `Unsupported type for anti-feature "${tag}": ${typeof description}`,
      );
    }
  }

  return result;
}
