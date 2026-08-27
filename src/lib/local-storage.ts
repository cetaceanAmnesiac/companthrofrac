export enum LocalStorageKey {
  MARKS = 'local:cc-marks',
}

export type VersionOf<T extends { version: number }> = T['version'];
