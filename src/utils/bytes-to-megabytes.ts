/**
 * Converts a size in bytes to megabytes and rounds to the nearest integer
 *
 * @param bytes - The size in bytes to convert
 * @returns The size in megabytes, rounded to the nearest integer
 *
 * @example
 * ```typescript
 * bytesToMegabytes(1048576) // returns 1 (1MB)
 * bytesToMegabytes(2097152) // returns 2 (2MB)
 * bytesToMegabytes(2621440) // returns 3 (2.5MB rounded up)
 * ```
 */
export function bytesToMegabytes(bytes: number) {
  // Convert bytes to megabytes
  const megabytes = bytes / (1024 * 1024);
  return Math.round(megabytes);
}
