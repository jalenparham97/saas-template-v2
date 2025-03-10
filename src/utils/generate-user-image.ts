/**
 * Generates a URL for an avatar image using the UI Avatars API.
 * @param username - The full name or username to generate an avatar for
 * @returns A URL string for the generated avatar image
 */
export function generateAvatarImage(username: string) {
  const name = username.split(" ")[0];
  return `https://ui-avatars.com/api/?name=${name}&length=1&background=random`;
}
