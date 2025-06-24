type GmApiGrants =
  | "addElement"
  | "addStyle"
  | "download"
  | "getResourceText"
  | "getResourceURL"
  | "info"
  | "log"
  | "notification"
  | "openInTab"
  | "registerMenuCommand"
  | "unregisterMenuCommand"
  | "setClipboard"
  | "getTab"
  | "saveTab"
  | "getTabs"
  | "setValue"
  | "getValue"
  | "deleteValue"
  | "listValues"
  | "setValues"
  | "getValues"
  | "deleteValues"
  | "addValueChangeListener"
  | "removeValueChangeListener"
  | "xmlhttpRequest"
  | "webRequest";

export type GrantTypes =
  | `GM_${GmApiGrants}`
  | `GM.${GmApiGrants}`
  | "unsafeWindow"
  | "window.onurlchange"
  | "window.close"
  | "window.focus";
