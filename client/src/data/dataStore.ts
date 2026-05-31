/**
 * dataStore.ts
 *
 * Mutable singleton that holds all project data for CondoCore.
 * Initialized empty, then populated by DbBridgeProviders with live database
 * data before the legacy CondoCore components mount.
 *
 * This allows the legacy CondoCore.jsx components to read from a single
 * source of truth that can be updated at runtime.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;

export interface DataStore {
  planTasks: AnyRecord[];
  contracts: AnyRecord[];
  insurances: AnyRecord[];
  permits: AnyRecord[];
  capitalStack: AnyRecord[];
  draws: AnyRecord[];
  stackingUnits: AnyRecord[];
  documents: AnyRecord[];
  /** True once DB data has been loaded and written into the store */
  dbLoaded: boolean;
}

const store: DataStore = {
  planTasks: [],
  contracts: [],
  insurances: [],
  permits: [],
  capitalStack: [],
  draws: [],
  stackingUnits: [],
  documents: [],
  dbLoaded: false,
};

export function getDataStore(): DataStore {
  return store;
}

export function setDataStore(patch: Partial<DataStore>): void {
  Object.assign(store, patch);
}
