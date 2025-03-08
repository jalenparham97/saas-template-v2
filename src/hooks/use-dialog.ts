import { useState } from "react";

/**
 * A custom React hook for managing dialog/modal state.
 *
 * This hook provides a simple way to handle the open/closed state of a dialog
 * along with handlers to control it.
 *
 * @returns A tuple containing:
 * - [0] boolean: The current open state of the dialog
 * - [1] Object with handlers:
 *   - open: Function to open the dialog
 *   - close: Function to close the dialog
 *   - toggle: Function to toggle the dialog state
 *
 * @example
 * ```tsx
 * function MyDialog() {
 *   const [isOpen, { open, close, toggle }] = useDialog();
 *
 *   return (
 *     <>
 *       <button onClick={open}>Open Dialog</button>
 *       {isOpen && (
 *         <div className="dialog">
 *           <h2>Dialog Content</h2>
 *           <button onClick={close}>Close</button>
 *         </div>
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
export const useDialog = (): [
  boolean,
  { open: () => void; close: () => void; toggle: () => void },
] => {
  const [open, setOpen] = useState(false);

  const handlers = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((prev) => !prev),
  };

  return [open, handlers];
};
