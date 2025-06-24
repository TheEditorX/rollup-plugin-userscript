import type { Node } from "acorn";
import { GRANTABLE_GM_APIS } from "../consts";
import { simple } from "acorn-walk";

export function detectGrants(ast: Node): string[] {
  const grants = new Set<string>();

  simple(ast, {
    Expression(node) {
      for (const gmApiKey in GRANTABLE_GM_APIS) {
        if (GRANTABLE_GM_APIS[gmApiKey](node)) {
          grants.add(gmApiKey);
        }
      }
    },
  });

  return Array.from(grants);
}
