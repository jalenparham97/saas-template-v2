import { UAParser } from "ua-parser-js";

/**
 * Parses a user agent string to extract browser, device, and OS information.
 *
 * @param userAgent - The user agent string from the browser request
 * @returns An object containing parsed information about:
 *  - Browser (name, version)
 *  - Device (model, type, vendor)
 *  - OS (name, version)
 *  - CPU (architecture)
 *  - Engine (name, version)
 *
 * @example
 * ```typescript
 * const ua = parseUserAgent(req.headers['user-agent']);
 * console.log(ua.browser); // { name: "Chrome", version: "96.0.4664.93" }
 * ```
 */
export function parseUserAgent(userAgent: string) {
  return UAParser(userAgent);
}
