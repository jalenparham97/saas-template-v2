import * as React from "react";

/**
 * The breakpoint width in pixels below which a device is considered mobile
 */
const MOBILE_BREAKPOINT = 768;

/**
 * A custom React hook that detects whether the current viewport is mobile-sized.
 * Uses a breakpoint of 768px (width < 768px is considered mobile).
 *
 * The hook updates automatically when the viewport is resized.
 *
 * @returns True if the viewport width is less than 768px, false otherwise
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *
 *   return (
 *     <div>
 *       {isMobile ? 'Mobile view' : 'Desktop view'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
