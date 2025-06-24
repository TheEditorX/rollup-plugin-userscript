import type { Identifier, Node } from "acorn";

export function isIdentifierExpression(node: Node): node is Identifier {
  return node.type === "Identifier";
}
