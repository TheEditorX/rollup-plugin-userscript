export interface LocalizableValue {
  /** The default value for the localizable string. Will be used if the user's locale is not available. */
  DEFAULT?: string;

  /** The localized values for different locales. The keys are locale identifiers (e.g., "en", "fr"). */
  [key: string]: string | undefined;
}
