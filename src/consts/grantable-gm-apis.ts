import type { Node } from "acorn";
import { isCallExpression, isIdentifierExpression } from "../utils";

export const BASIC_GM_API_NAMES: string[] = [
  "addElement",
  "addStyle",
  "download",
  "getResourceText",
  "getResourceURL",
  "info",
  "log",
  "notification",
  "openInTab",
  "registerMenuCommand",
  "unregisterMenuCommand",
  "setClipboard",
  "getTab",
  "saveTab",
  "getTabs",
  "setValue",
  "getValue",
  "deleteValue",
  "listValues",
  "setValues",
  "getValues",
  "deleteValues",
  "addValueChangeListener",
  "removeValueChangeListener",
  "xmlhttpRequest",
  "webRequest",
];

const BASIC_GM_API = Object.fromEntries(
  BASIC_GM_API_NAMES.flatMap((key) => {
    const matcher = createMatchGMApiCall(`GM_${key}`, key);
    return [
      [`GM_${key}`, matcher],
      [`GM.${key}`, matcher],
    ];
  }),
);

export const GRANTABLE_GM_APIS: Record<string, (node: Node) => boolean> = {
  ...BASIC_GM_API,
  unsafeWindow: (node: Node) => {
    if (!isIdentifierExpression(node)) return false;
    return node.name === "unsafeWindow";
  },
  "window.close": (node: Node) => {
    if (!isCallExpression(node)) return false;
    return (
      node.callee.type === "MemberExpression" &&
      node.callee.object.type === "Identifier" &&
      node.callee.object.name === "window" &&
      node.callee.property.type === "Identifier" &&
      node.callee.property.name === "close"
    );
  },
  "window.onurlchange": (node: Node) => {
    if (!isCallExpression(node)) return false;
    return (
      node.callee.type === "MemberExpression" &&
      node.callee.object.type === "Identifier" &&
      node.callee.object.name === "window" &&
      node.callee.property.type === "Identifier" &&
      node.callee.property.name === "onurlchange"
    );
  },
  "window.focus": (node: Node) => {
    if (!isCallExpression(node)) return false;
    return (
      node.callee.type === "MemberExpression" &&
      node.callee.object.type === "Identifier" &&
      node.callee.object.name === "window" &&
      node.callee.property.type === "Identifier" &&
      node.callee.property.name === "focus"
    );
  },
};

function createMatchGMApiCall(
  globalName: string,
  methodName: string,
  parentName: string = "GM",
): (node: Node) => boolean {
  return (node: Node) => {
    if (!isCallExpression(node)) return false;
    switch (node.callee.type) {
      case "Identifier":
        return node.callee.name === globalName;
      case "MemberExpression":
        return (
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === parentName &&
          node.callee.property.type === "Identifier" &&
          node.callee.property.name === methodName
        );
      default:
        return false;
    }
  };
}
