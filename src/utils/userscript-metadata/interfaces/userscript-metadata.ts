import { BASIC_GM_API_NAMES } from "../../../consts";
import { LocalizableValue } from "./localizable-value";
import { URLWithIntegrity } from "./url-with-integrity";
import { RunAt } from "../enums";

type MatchPatternScheme =
  | "http"
  | "https"
  | "http*"
  | "file"
  | "ftp"
  | "urn"
  | "ws"
  | "wss"
  | "data"
  | "chrome-extension"
  | "extension"
  | "*";
type MatchPatternHost = string | `*.${string}` | "*";
type MatchPatternPath = `/${string}` | "/*";
type MatchPatternPort = `:${number}` | "";
type MatchPattern =
  `${MatchPatternScheme}://${MatchPatternHost}${MatchPatternPort}${MatchPatternPath}`;

export interface UserscriptMetadata {
  /** The name of the script */
  name: LocalizableValue | string;

  /** The namespace of the script */
  namespace: string;

  /** A copyright statement shown at the header of the script's editor right below the script name. */
  copyright: string;

  /** The script version. This is used for the update check and needs to be increased at every update. */
  version: string;

  /** A short significant description. */
  description: LocalizableValue | string;

  /** A URL to the script's icon in low resolution */
  icon: string;

  /** A URL to the script's icon in high resolution (64x64 pixels) */
  icon64: string;

  /** A list of API functions to whitelist */
  grant:
    | Array<
        | `GM_${(typeof BASIC_GM_API_NAMES)[number]}`
        | `GM.${(typeof BASIC_GM_API_NAMES)[number]}`
        | "unsafeWindow"
        | "window.onurlchange"
        | "window.close"
        | "window.focus"
        | string
      >
    | "none";

  /** The scripts author. */
  author: string;

  /** The scripts homepage URL. */
  homepage: string;

  /**
   * This tag allows script developers to disclose whether they monetize their scripts.
   * It is for example required by [GreasyFork](https://greasyfork.org/).
   */
  antifeatures: Partial<
    Record<
      "ads" | "tracking" | "miner",
      LocalizableValue | string | null | undefined
    >
  >;

  /** Points to a JavaScript file that is loaded and executed before the script itself starts running */
  require: Array<string | URLWithIntegrity>;

  // /** Preloads resources that can be accessed via `GM_getResourceURL` and `GM_getResourceText` by the script */
  // resources: Record<string, string | URLWithIntegrity>;

  /** The pages that a script should run on. Doesn't support the URL hash parameter. */
  include: Array<string | RegExp>;

  /** The pages that a script should run on */
  match: Array<MatchPattern>;

  /**
   * Exclude URLs even it they are included by {@link include} or {@link match}
   */
  exclude: Array<string | RegExp>;

  /**
   * Defines the moment the script is injected.
   * In opposition to other script handlers, `runAt` defines the first possible moment a script wants to run.
   * This means it may happen that a script that uses the @require tag may be executed after the document is already loaded, cause fetching the required script took that long.
   *
   * Anyhow, all `DOMNodeInserted`, `DOMContentLoaded` and `load` events fired after the given injection moment are cached and delivered to listeners registered via the sandbox's `window.addEventListener` method.
   *
   * @default {@link RunAt.DocumentEnd}
   */
  runAt: RunAt;

  /** You can add tags to your script which will be visible in the script list if this tag is part of your system's tag list. Tags can be useful to categorize your scripts or to mark them as a certain type. The list of tags can be found at the script's settings page. */
  tags: Array<string>;

  /** This tag defines the domains (no top-level domains) including subdomains which are allowed to be retrieved by `GM_xmlhttpRequest` */
  connect: Array<
    | string
    | "self"
    | "localhost"
    | "*"
    | `${number}.${number}.${number}.${number}`
  >;

  /** This tag makes the script running on the main pages, but not at iframes */
  noframes: boolean;

  /** An update URL for the userscript */
  updateURL: string;

  /** Defines the URL where the script will be downloaded from when an update was detected. If the value none is used, then no update check will be done. */
  downloadURL: string | "none";

  /** Defines the URL where the user can report issues and get personal support */
  supportURL: string;

  /** Injects the userscript without any wrapper and sandbox into the page, which might be useful for Scriptlets */
  unwrap: boolean;
}
