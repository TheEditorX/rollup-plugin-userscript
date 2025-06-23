import type { Node } from "acorn";
import { isCallExpression, isIdentifierExpression } from "../utils";

export const BASIC_GM_API_NAMES: Array<`GM_${string}`> = [
  "GM_addElement",
  "GM_addStyle",
  "GM_download",
  "GM_getResourceText",
  "GM_getResourceURL",
  "GM_info",
  "GM_log",
  "GM_notification",
  "GM_openInTab",
  "GM_registerMenuCommand",
  "GM_unregisterMenuCommand",
  "GM_setClipboard",
  "GM_getTab",
  "GM_saveTab",
  "GM_getTabs",
  "GM_setValue",
  "GM_getValue",
  "GM_deleteValue",
  "GM_listValues",
  "GM_setValues",
  "GM_getValues",
  "GM_deleteValues",
  "GM_addValueChangeListener",
  "GM_removeValueChangeListener",
  "GM_xmlhttpRequest",
  "GM_webRequest",
];

const BASIC_GM_API = Object.fromEntries(
  BASIC_GM_API_NAMES.flatMap((key) => {
    const plainKey = key.substring(3);
    const matcher = createMatchGMApiCall(key, plainKey);
    return [
      [key, matcher],
      [`GM.${plainKey}`, matcher],
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
