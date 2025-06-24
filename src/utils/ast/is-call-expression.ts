import type { CallExpression, Node } from "acorn";

export function isCallExpression(node: Node): node is CallExpression {
  return node.type === "CallExpression";
}
