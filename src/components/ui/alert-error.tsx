import { cn } from "@/lib/utils";

interface AlertProps {
  message?: string;
  className?: string;
}

export function AlertError({ message, className }: AlertProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "bg-destructive/15 text-destructive flex items-center space-x-3 rounded-lg p-3 text-sm",
        className,
      )}
    >
      <p>{message}</p>
    </div>
  );
}
