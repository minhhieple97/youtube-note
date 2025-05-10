// Shared types that can be used across multiple features
export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
}

export interface SyncStatus {
  lastSynced: string;
  isSyncing: boolean;
  error?: string;
}
