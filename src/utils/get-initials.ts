/**
 * Extracts initials from a given string by taking the first letter of each word
 *
 * @param string - The input string to extract initials from
 * @param initialLength - The number of initials to return (default: 2)
 * @returns A string containing the initials, or an empty string if input is null/undefined
 *
 * @example
 * ```typescript
 * getInitials("John Doe")           // returns "JD"
 * getInitials("John Doe", 1)        // returns "J"
 * getInitials("Alice Bob Charles")  // returns "AB"
 * getInitials(null)                 // returns ""
 * ```
 */
export function getInitials(
  string: string | null | undefined,
  initialLength = 2,
): string {
  if (string) {
    const initials = string.split(" ");

    if (initialLength === 1) return `${initials[0]?.charAt(0)}`;

    return `${initials[0]?.charAt(0)}${initials[1]?.charAt(0)}`;
  }

  return "";
}
