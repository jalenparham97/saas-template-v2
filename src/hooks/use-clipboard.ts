import { useState } from "react";

/**
 * A React hook for managing clipboard operations with a timeout for the "copied" state.
 *
 * @param options - Configuration options for the clipboard hook
 * @param options.timeout - Duration in milliseconds before resetting the copied state (default: 2000ms)
 *
 * @returns An object containing:
 * - copy: (valueToCopy: string) => void - Function to copy text to clipboard
 * - reset: () => void - Function to reset the clipboard state
 * - error: Error | null - Any error that occurred during clipboard operations
 * - copied: boolean - Whether the text was successfully copied
 *
 * @example
 * ```tsx
 * const { copy, copied, error } = useClipboard({ timeout: 3000 });
 *
 * return (
 *   <button onClick={() => copy("Text to copy")}>
 *     {copied ? "Copied!" : "Copy"}
 *   </button>
 * );
 * ```
 *
 * @throws {Error} When navigator.clipboard is not supported in the browser
 */
export function useClipboard({ timeout = 2000 } = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleCopyResult = (value: boolean) => {
    clearTimeout(copyTimeout!);
    setCopyTimeout(setTimeout(() => setCopied(false), timeout));
    setCopied(value);
  };

  const copy = (valueToCopy: string) => {
    if ("clipboard" in navigator) {
      navigator.clipboard
        .writeText(valueToCopy)
        .then(() => handleCopyResult(true))
        .catch((err) => setError(err));
    } else {
      setError(new Error("useClipboard: navigator.clipboard is not supported"));
    }
  };

  const reset = () => {
    setCopied(false);
    setError(null);
    clearTimeout(copyTimeout!);
  };

  return { copy, reset, error, copied };
}
