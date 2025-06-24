import { LocalizableValue, URLWithIntegrity } from "../interfaces";

export default function buildDefaultMetadataProp(
  propertyName: string,
  value:
    | string
    | LocalizableValue
    | RegExp
    | Array<string | RegExp | URLWithIntegrity>
    | URLWithIntegrity,
): string[][] {
  const directiveToken = `@${propertyName}`;

  if (typeof value === "string") return [[directiveToken, value]];
  if (value instanceof RegExp) return [[directiveToken, value.toString()]];
  if (Array.isArray(value)) {
    return value.map((v) => {
      if (typeof v === "object" && "url" in v) {
        // Handle URL with integrity
        const urlWithIntegrity = v as URLWithIntegrity;
        const integrityPart =
          urlWithIntegrity.integrity ? `#${urlWithIntegrity.integrity}` : "";
        return [directiveToken, `${urlWithIntegrity.url}${integrityPart}`];
      }
      return [directiveToken, v.toString()];
    });
  }
  if (typeof value === "object") {
    if ("url" in value) {
      // Handle URL with integrity
      const urlWithIntegrity = value as URLWithIntegrity;
      const integrityParts = Object.entries(
        urlWithIntegrity.integrity ?? {},
      ).map(([algorithm, hash]) => `${algorithm}=${hash}`);
      const integrityPart =
        integrityParts.length ? `#${integrityParts.join(",")}` : "";
      return [[directiveToken, `${urlWithIntegrity.url}${integrityPart}`]];
    }
    const { DEFAULT, ...localizations } = value;
    const result: string[][] = [];
    if (DEFAULT) {
      result.push([directiveToken, DEFAULT]);
    }
    for (const [lang, localizedValue] of Object.entries(localizations)) {
      if (localizedValue == undefined) continue; // Skip undefined or empty values
      result.push([`${directiveToken}:${lang}`, localizedValue]);
    }

    return result;
  }

  throw new Error(
    `Unsupported value type for metadata property "${propertyName}": ${typeof value}`,
  );
}
