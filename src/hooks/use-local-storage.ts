import { useWindow } from "./use-window";

/**
 * A custom React hook that provides access to the browser's localStorage API.
 * Returns undefined if window is not available (e.g., during SSR).
 *
 * @returns The window.localStorage object if available, otherwise undefined
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const localStorage = useLocalStorage();
 *
 *   useEffect(() => {
 *     if (localStorage) {
 *       localStorage.setItem('key', 'value');
 *       const value = localStorage.getItem('key');
 *     }
 *   }, [localStorage]);
 * }
 * ```
 */
export function useLocalStorage() {
  const window = useWindow();
  return window?.localStorage;
}
