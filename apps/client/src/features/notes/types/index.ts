export interface Note {
  id: string;
  videoId: string;
  timestamp: number; // Time in seconds
  formattedTime: string; // Human-readable timestamp format
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  channelName: string;
  url: string;
}

export interface NotesStorage {
  [videoId: string]: Note[];
}
