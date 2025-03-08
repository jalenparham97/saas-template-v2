import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A custom React hook that tracks the hover state of an HTML element.
 *
 * @generic T - The type of HTML element to track, defaults to HTMLDivElement
 *
 * @returns An object containing:
 * - ref: A React ref to attach to the target element
 * - hovered: A boolean indicating whether the element is currently being hovered
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ref, hovered } = useHover<HTMLDivElement>();
 *   return (
 *     <div ref={ref}>
 *       {hovered ? 'Hovered!' : 'Not hovered'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useHover<T extends HTMLElement = HTMLDivElement>() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<T>(null);
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener("mouseenter", onMouseEnter);
      element.addEventListener("mouseleave", onMouseLeave);

      return () => {
        element.removeEventListener("mouseenter", onMouseEnter);
        element.removeEventListener("mouseleave", onMouseLeave);
      };
    }

    return undefined;
  }, [onMouseEnter, onMouseLeave]);

  return { ref, hovered };
}
