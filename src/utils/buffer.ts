import { type Readable } from "node:stream";

/**
 * Converts a Node.js Readable stream into a Buffer
 *
 * This utility function collects all chunks from a readable stream and concatenates
 * them into a single Buffer. It handles both string and Buffer chunks, converting
 * string chunks to Buffers automatically.
 *
 * @param readable - A Node.js Readable stream to be converted
 * @returns Promise<Buffer> A promise that resolves with the complete Buffer containing all stream data
 *
 * @example
 * ```typescript
 * const stream = fs.createReadStream('file.txt');
 * const buf = await buffer(stream);
 * console.log(buf.toString());
 * ```
 */
export async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
