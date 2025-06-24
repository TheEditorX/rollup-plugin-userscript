export interface URLWithIntegrity {
  /** The URL to the resource */
  url: string;

  /** The integrity hash of the resource */
  integrity?: {
    sha256: string;
    md5?: string;
  };
}
