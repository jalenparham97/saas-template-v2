import { useEffect, useRef, useState } from "react";

export function useDebouncedState<T = unknown>(
  defaultValue: T,
  wait: number,
  options = { leading: false },
) {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<number>();
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
