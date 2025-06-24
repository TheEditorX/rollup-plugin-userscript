import {
  compileDirectivesFromMetadata,
  UserscriptMetadata,
} from "./userscript-metadata";
import { formatTable } from "./format-table";

export function buildMetadataBlock(
  metadata: Partial<UserscriptMetadata>,
): string {
  const directives = compileDirectivesFromMetadata(metadata);
  const formattedDirectives = formatTable(directives)
    .split("\n")
    .map((line) => `// ${line}`)
    .join("\n");
  return `// ==UserScript==\n${formattedDirectives}\n// ==/UserScript==\n`;
}
