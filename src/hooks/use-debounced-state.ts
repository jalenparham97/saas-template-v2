import { useEffect, useRef, useState } from "react";

/**
 * A custom hook that creates a debounced state value.
 *
 * @template T - The type of the state value
 * @param defaultValue - The initial value of the state
 * @param wait - The number of milliseconds to delay
 * @param options - Configuration options object
 * @param options.leading - If true, the state will be updated on the leading edge of the timeout (default: false)
 *
 * @returns A tuple containing:
 * - The current state value
 * - A function to update the state value with debouncing
 *
 * @example
 * ```tsx
 * const [value, setValue] = useDebouncedState("initial", 500);
 * setValue("new value"); // Will update after 500ms
 * ```
 */
export function useDebouncedState<T = unknown>(
  defaultValue: T,
  wait: number,
  options = { leading: false },
) {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<number | undefined>(undefined);
  const leadingRef = useRef(true);

  const clearTimeout = () => window.clearTimeout(timeoutRef.current);
  useEffect(() => clearTimeout, []);

  const setDebouncedValue = (newValue: T) => {
    clearTimeout();
    if (leadingRef.current && options.leading) {
      setValue(newValue);
    } else {
      timeoutRef.current = window.setTimeout(() => {
        leadingRef.current = true;
        setValue(newValue);
      }, wait);
    }
    leadingRef.current = false;
  };

  return [value, setDebouncedValue] as const;
}
