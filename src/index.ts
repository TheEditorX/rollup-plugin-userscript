import type { RollupUserscriptOptions } from "../types";
import type { GrantTypes } from "../types/grant-types";
import type { Plugin } from "rollup";
import { buildMetadataBlock, detectGrants } from "./utils";
import { parse } from "acorn";
import * as fs from "fs/promises";

export default async function userscript(
  options: Partial<RollupUserscriptOptions>,
): Promise<Plugin<never>> {
  const { autoDetectGrants, icon, ...rawOptions } = options;

  const pkg = JSON.parse(await fs.readFile("package.json", "utf-8"));

  const defaultOptions: Partial<RollupUserscriptOptions> = {
    name: pkg.displayName || pkg.name,
    author: pkg.author,
    description: pkg.description,
    version: pkg.version,
  };

  return {
    name: "userscript",

    async generateBundle(_options, bundles) {
      for (const [, bundleDetails] of Object.entries(bundles)) {
        if (bundleDetails.type !== "chunk") continue;

        const compiledOptions = rawOptions;
        if (autoDetectGrants) {
          await fs.writeFile("temp.js", bundleDetails.code);
          const ast = parse(bundleDetails.code, {
            ecmaVersion: "latest",
            sourceType: "module",
          });
          const detectedGrants = detectGrants(ast);
          if (!compiledOptions.grants || compiledOptions.grants === "none")
            compiledOptions.grants = detectedGrants as GrantTypes[];
          else
            compiledOptions.grants = [
              ...new Set([...compiledOptions.grants, ...detectedGrants]),
            ] as GrantTypes[];
        }

        const banner = buildMetadataBlock({
          ...defaultOptions,
          ...compiledOptions,
          grant: compiledOptions.grants,
          icon: icon?.lowResolution,
          icon64: icon?.highResolution,
        });
        bundleDetails.code = `${banner}${bundleDetails.code}`;
      }
    },
  };
}
