import { useEffect, useState } from "react";

/**
 * A React hook that safely provides access to the window object in both client and server environments.
 *
 * This hook handles SSR (Server Side Rendering) scenarios by checking if the window object
 * is available before attempting to use it. It returns undefined during server-side rendering
 * and the window object once available on the client side.
 *
 * @returns The window object if available, undefined otherwise
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const window = useWindow();
 *
 *   if (!window) {
 *     return null; // or loading state
 *   }
 *
 *   return <div>Window width: {window.innerWidth}</div>;
 * }
 * ```
 */
export const useWindow = () => {
  const [docWindow, setDocWindow] = useState<Window>();
  const isWindow = typeof window !== "undefined";
  useEffect(() => {
    if (isWindow) {
      setDocWindow(window);
    }
  }, [isWindow]);
  return docWindow;
};
