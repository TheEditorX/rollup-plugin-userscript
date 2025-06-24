import type { Plugin } from "rollup";
import { GrantTypes } from "./grant-types";

interface LocalizableValue {
  /** The fallback value if localization is not available */
  DEFAULT?: string;

  /** Optional localized values for different languages */
  [language: string]: string | undefined;
}

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

export const enum RunAt {
  /** The script will be injected as fast as possible. */
  DocumentStart = "document-start",

  /** The script will be injected if the body element exists. */
  DocumentBody = "document-body",

  /** The script will be injected when or after the DOMContentLoaded event was dispatched. */
  DocumentEnd = "document-end",

  /** The script will be injected after the DOMContentLoaded event was dispatched. */
  Idle = "document-idle",

  /**
   * The script will be injected if it is clicked at the browser context menu.
   *
   * @remarks All include and exclude statements will be ignored if this value is used, but this may change in the future.
   */
  ContextMenu = "context-menu",
}

export interface URLWithIntegrity {
  /** The URL to the resource */
  url: string;

  /** The integrity hash of the resource */
  integrity?: {
    sha256: string;
    md5?: string;
  };
}

export interface RollupUserscriptOptions {
  /**
   * The name of the userscript. Localization is supported by providing an object.
   *
   * Defaults to the `displayName` or `name` from `package.json` if available. In this case localization is not supported.
   * @tampermonkey-directive @name
   */
  name?: string | LocalizableValue;

  /**
   * The namespace of the userscript
   *
   * @tampermonkey-directive @namespace
   */
  namespace?: string;

  /**
   * A copyright statement shown at the header of the script's editor right below the script name
   *
   * @tampermonkey-directive @copyright
   */
  copyright?: string;

  /**
   * The script version. This is used for the update check and needs to be increased at every update.
   *
   * Defaults to the `version` from `package.json`.
   * @tampermonkey-directive @version
   */
  version?: string;

  /**
   * A short significant description. Localization is supported by providing an object.
   *
   * Defaults to the `description` from `package.json` if available. In this case localization is not supported.
   * @tampermonkey-directive @description
   */
  description?: string | LocalizableValue;

  /** Defines the icon for the userscript. */
  icon?: {
    /**
     * The URL to the script's icon in low resolution (16x16 pixels).
     *
     * @tampermonkey-directive @icon
     */
    lowResolution?: string;

    /**
     * The URL to the script's icon in high resolution (64x64 pixels).
     *
     * @tampermonkey-directive @icon64
     */
    highResolution?: string;
  };

  /** Whether to automatically detect grants based on the script's code. */
  autoDetectGrants?: boolean;

  /**
   * The grants the userscript requires.
   * When used in conjunction with {@see autoDetectGrants}, any grants that are automatically detected will be added to this list.
   *
   * @tampermonkey-directive @grant
   */
  grants?: "none" | Array<GrantTypes>;

  /**
   * The script's author.
   *
   * Defaults to the `author` from `package.json` if available.
   * @tampermonkey-directive @author
   */
  author?: string;

  /**
   * The script's homepage URL.
   *
   * Defaults to the `homepage` from `package.json` if available.
   * @tampermonkey-directive @homepage
   */
  homepage?: string;

  /**
   * Allows script developers to disclose whether they monetize their scripts.
   * For example, it is required by [GreasyFork](https://greasyfork.org/).
   *
   * This is an object with three possible antifeature tags: `ads`, `tracking`, and `miner`. Each can have a (localized) description.
   *
   * @tampermonkey-directive @antifeature
   */
  antifeatures?: {
    ads?: string | LocalizableValue;
    tracking?: string | LocalizableValue;
    miner?: string | LocalizableValue;
  };

  /**
   * Points to a JavaScript file that is loaded and executed before the script itself starts running.
   *
   * @remarks the scripts loaded via @require and their "use strict" statements might influence the userscript's strict mode!
   * @tampermonkey-directive @require
   */
  require?: Array<string | URLWithIntegrity>;

  /**
   * The pages that a script should run on. Doesn't support the URL hash parameter.
   *
   * @tampermonkey-directive @include
   */
  include: Array<string | RegExp>;

  /**
   * The pages that a script should run on
   *
   * @tampermonkey-directive @match
   */
  match: Array<MatchPattern>;

  /**
   * Exclude URLs even it they are included by {@link include} or {@link match}
   *
   * @tampermonkey-directive @exclude
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
   * @tampermonkey-directive @run-at
   */
  runAt: RunAt;

  /**
   * You can add tags to your script which will be visible in the script list if this tag is part of your system's tag list. Tags can be useful to categorize your scripts or to mark them as a certain type. The list of tags can be found at the script's settings page.
   *
   * @tampermonkey-directive @tags
   */
  tags: Array<string>;

  /**
   * This tag defines the domains (no top-level domains) including subdomains which are allowed to be retrieved by `GM_xmlhttpRequest`
   *
   * @tampermonkey-directive @connect
   */
  connect: Array<
    | string
    | "self"
    | "localhost"
    | "*"
    | `${number}.${number}.${number}.${number}`
  >;

  /**
   * This tag makes the script running on the main pages, but not at iframes
   *
   * @tampermonkey-directive @noframes
   */
  noframes: boolean;

  /**
   * An update URL for the userscript
   *
   * @tampermonkey-directive @updateURL
   */
  updateURL: string;

  /**
   * Defines the URL where the script will be downloaded from when an update was detected. If the value none is used, then no update check will be done.
   *
   * @tampermonkey-directive @downloadURL
   */
  downloadURL: string | "none";

  /**
   * Defines the URL where the user can report issues and get personal support
   *
   * @tampermonkey-directive @supportURL
   */
  supportURL: string;

  /**
   * Injects the userscript without any wrapper and sandbox into the page, which might be useful for Scriptlets
   *
   * @tampermonkey-directive @unwrap
   */
  unwrap: boolean;
}

export default function userscript(
  options: Partial<RollupUserscriptOptions>,
): Promise<Plugin>;
