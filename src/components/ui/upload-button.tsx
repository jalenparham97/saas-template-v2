import { DefaultButton as Button } from "@/components/ui/button";
import type { UploadHookControl } from "better-upload/client";
import { Loader2, Upload } from "lucide-react";
import { useId } from "react";

type UploadButtonProps = {
  control: UploadHookControl<false>;
  accept?: string;
  metadata?: Record<string, unknown>;
  uploadOverride?: (
    ...args: Parameters<UploadHookControl<false>["upload"]>
  ) => void;

  // Add any additional props you need.
  variant?: "outline" | "ghost" | "default";
  text?: string;
  disabled?: boolean;
};

export function UploadButton({
  control: { upload, isPending },
  accept,
  metadata,
  uploadOverride,
  variant = "default",
  text = "Upload file",
  disabled,
}: UploadButtonProps) {
  const id = useId();

  return (
    <Button
      disabled={disabled || isPending}
      className="relative"
      type="button"
      variant={variant}
    >
      <label htmlFor={id} className="absolute inset-0 cursor-pointer">
        <input
          id={id}
          className="absolute inset-0 size-0 opacity-0"
          type="file"
          accept={accept}
          onChange={(e) => {
            if (e.target.files?.[0] && !isPending) {
              if (uploadOverride) {
                uploadOverride(e.target.files[0], { metadata });
              } else {
                upload(e.target.files[0], { metadata });
              }
            }
            e.target.value = "";
          }}
        />
      </label>
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin mr-2" />
          {text}
        </>
      ) : (
        <>
          <Upload className="size-4 mr-2" />
          {text}
        </>
      )}
    </Button>
  );
}
