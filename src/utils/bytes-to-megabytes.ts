export function bytesToMegabytes(bytes: number) {
  // Convert bytes to megabytes
  const megabytes = bytes / (1024 * 1024);
  return Math.round(megabytes);
}
