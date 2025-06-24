import { UserscriptMetadata } from "./interfaces";
import buildDefaultMetadataProp from "./metadata-prop-builders/default";
import buildAntiFeatures from "./metadata-prop-builders/antifeature";

interface DirectiveBuilder<K extends keyof UserscriptMetadata = any> {
  directive: keyof UserscriptMetadata;
  build: (value: UserscriptMetadata[K]) => string[][];
}

function createDirectiveBuilder<K extends keyof UserscriptMetadata>(
  directive: K,
  build: (value: UserscriptMetadata[K]) => string[][],
): DirectiveBuilder<K> {
  return { directive, build };
}

const DIRECTIVE_BUILDERS: Array<DirectiveBuilder> = [
  createDirectiveBuilder("name", (value) =>
    buildDefaultMetadataProp("name", value),
  ),
  createDirectiveBuilder("namespace", (value) =>
    buildDefaultMetadataProp("namespace", value),
  ),
  createDirectiveBuilder("copyright", (value) =>
    buildDefaultMetadataProp("copyright", value),
  ),
  createDirectiveBuilder("version", (value) =>
    buildDefaultMetadataProp("version", value),
  ),
  createDirectiveBuilder("description", (value) =>
    buildDefaultMetadataProp("description", value),
  ),
  createDirectiveBuilder("icon", (value) =>
    buildDefaultMetadataProp("icon", value),
  ),
  createDirectiveBuilder("icon64", (value) =>
    buildDefaultMetadataProp("icon64", value),
  ),
  createDirectiveBuilder("grant", (value) =>
    buildDefaultMetadataProp("grant", value),
  ),
  createDirectiveBuilder("author", (value) =>
    buildDefaultMetadataProp("author", value),
  ),
  createDirectiveBuilder("homepage", (value) =>
    buildDefaultMetadataProp("homepage", value),
  ),
  createDirectiveBuilder("antifeatures", (value) => buildAntiFeatures(value)),
  createDirectiveBuilder("require", (value) =>
    buildDefaultMetadataProp("require", value),
  ),
  createDirectiveBuilder("include", (value) =>
    buildDefaultMetadataProp("include", value),
  ),
  createDirectiveBuilder("match", (value) =>
    buildDefaultMetadataProp("match", value),
  ),
  createDirectiveBuilder("exclude", (value) =>
    buildDefaultMetadataProp("exclude", value),
  ),
  createDirectiveBuilder("runAt", (value) =>
    buildDefaultMetadataProp("run-at", value),
  ),
  createDirectiveBuilder("tags", (value) =>
    buildDefaultMetadataProp("tags", value),
  ),
  createDirectiveBuilder("connect", (value) =>
    buildDefaultMetadataProp("connect", value),
  ),
  createDirectiveBuilder("noframes", () => [["@noframes"]]),
  createDirectiveBuilder("updateURL", (value) =>
    buildDefaultMetadataProp("updateURL", value),
  ),
  createDirectiveBuilder("downloadURL", (value) =>
    buildDefaultMetadataProp("downloadURL", value),
  ),
  createDirectiveBuilder("supportURL", (value) =>
    buildDefaultMetadataProp("supportURL", value),
  ),
  createDirectiveBuilder("unwrap", () => [["@unwrap"]]),
];

export function compileDirectivesFromMetadata(
  metadata: Partial<UserscriptMetadata>,
): string[][] {
  return Array.from(
    (function* () {
      for (const builder of DIRECTIVE_BUILDERS) {
        const value = metadata[builder.directive];
        if (!value) continue;
        const directives = builder.build(value);
        for (const directive of directives) {
          yield directive;
        }
      }
    })(),
  );
}
