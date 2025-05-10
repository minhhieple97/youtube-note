/**
 * Formats seconds into a human-readable timestamp
 * @param seconds - Time in seconds
 * @returns Formatted timestamp (e.g., "1:23:45" or "3:45")
 */
export const formatTimestamp = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Parses a formatted timestamp back into seconds
 * @param timestamp - Formatted timestamp (e.g., "1:23:45" or "3:45")
 * @returns Time in seconds
 */
export const parseTimestamp = (timestamp: string): number => {
  const parts = timestamp.split(':').map((part) => parseInt(part, 10));

  if (parts.length === 3) {
    // Format: hours:minutes:seconds
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // Format: minutes:seconds
    return parts[0] * 60 + parts[1];
  }

  return 0;
};
