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
   * @remarks All {@link UserscriptMetadata.include} and {@link UserscriptMetadata.exclude} statements will be ignored if this value is used, but this may change in the future.
   */
  ContextMenu = "context-menu",
}
