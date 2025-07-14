import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { UploadHookControl } from "better-upload/client";
import { formatBytes } from "better-upload/client/helpers";
import { Dot, File, Upload } from "lucide-react";
import { useId } from "react";
import { useDropzone } from "react-dropzone";

type UploadDropzoneProgressProps = {
  control: UploadHookControl<true>;
  accept?: string;
  metadata?: Record<string, unknown>;
  description?:
    | {
        fileTypes?: string;
        maxFileSize?: string;
        maxFiles?: number;
      }
    | string;
  uploadOverride?: (
    ...args: Parameters<UploadHookControl<true>["upload"]>
  ) => void;

  // Add any additional props you need.
};

export function UploadDropzoneProgress({
  control: { upload, isPending, progresses },
  accept,
  metadata,
  description,
  uploadOverride,
}: UploadDropzoneProgressProps) {
  const id = useId();

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop: (files) => {
      if (files.length > 0) {
        if (uploadOverride) {
          uploadOverride(files, { metadata });
        } else {
          upload(files, { metadata });
        }
      }
      inputRef.current.value = "";
    },
    noClick: true,
  });

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "relative rounded-lg border border-dashed transition-colors",
          {
            "border-primary/70": isDragActive,
          },
        )}
      >
        <label
          {...getRootProps()}
          className={cn(
            "flex w-full min-w-80 cursor-pointer flex-col items-center justify-center rounded-lg bg-muted/5 px-2 py-6 transition-colors dark:bg-background",
            {
              "cursor-not-allowed bg-muted/20 text-muted-foreground": isPending,
              "hover:bg-muted/30 hover:dark:bg-muted/15": !isPending,
            },
          )}
          htmlFor={id}
        >
          <div className="my-2">
            <Upload className="size-6" />
          </div>

          <div className="mt-3 space-y-1 text-center">
            <p className="text-sm font-semibold">Drag and drop files here</p>

            <p className="max-w-64 text-xs text-muted-foreground">
              {typeof description === "string" ? (
                description
              ) : (
                <>
                  {description?.maxFiles &&
                    `You can upload ${description.maxFiles} file${description.maxFiles !== 1 ? "s" : ""}.`}{" "}
                  {description?.maxFileSize &&
                    `${description.maxFiles !== 1 ? "Each u" : "U"}p to ${description.maxFileSize}.`}{" "}
                  {description?.fileTypes &&
                    `Accepted ${description.fileTypes}.`}
                </>
              )}
            </p>
          </div>

          <input
            {...getInputProps()}
            type="file"
            multiple
            id={id}
            accept={accept}
            disabled={isPending}
          />
        </label>

        {isDragActive && (
          <div className="pointer-events-none absolute inset-0 rounded-lg bg-background">
            <div className="flex size-full flex-col items-center justify-center rounded-lg bg-muted/15">
              <div className="my-2">
                <Upload className="size-6" />
              </div>

              <p className="mt-3 text-sm font-semibold">Drop files here</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {progresses.map((progress) => (
          <div
            key={progress.objectKey}
            className={cn("flex flex-col gap-2.5 rounded-lg border p-3", {
              "border-red-500/70 bg-red-500/[0.03]":
                progress.status === "failed",
            })}
          >
            <div className="flex items-center gap-2">
              <FileIcon type={progress.type} />

              <div className="space-y-1">
                <p className="text-sm font-medium">{progress.name}</p>

                <div className="flex items-center gap-0.5 text-xs">
                  <p className="text-muted-foreground">
                    {formatBytes(progress.size)}
                  </p>

                  <Dot className="size-4 text-muted-foreground" />

                  <p>
                    {progress.status === "failed" ? (
                      <span className="text-red-500">Failed</span>
                    ) : progress.progress < 1 ? (
                      `${(progress.progress * 100).toFixed(0)}%`
                    ) : (
                      "Completed"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {progress.progress < 1 && progress.status !== "failed" && (
              <Progress className="h-1.5" value={progress.progress * 100} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const iconCaptions = {
  "image/": "IMG",
  "video/": "VID",
  "audio/": "AUD",
  "application/pdf": "PDF",
  "application/zip": "ZIP",
  "application/x-rar-compressed": "RAR",
  "application/x-7z-compressed": "7Z",
  "application/x-tar": "TAR",
  "application/json": "JSON",
  "application/javascript": "JS",
  "text/plain": "TXT",
  "text/csv": "CSV",
  "text/html": "HTML",
  "text/css": "CSS",
  "application/xml": "XML",
  "application/x-sh": "SH",
  "application/x-python-code": "PY",
  "application/x-executable": "EXE",
  "application/x-disk-image": "ISO",
};

function FileIcon({ type }: { type: string }) {
  const caption = Object.entries(iconCaptions).find(([key]) =>
    type.startsWith(key),
  )?.[1];

  return (
    <div className="relative shrink-0">
      <File className="size-12 text-muted-foreground" strokeWidth={1} />

      {caption && (
        <span className="absolute bottom-2.5 left-0.5 rounded bg-primary px-1 py-px text-xs font-semibold text-primary-foreground select-none">
          {caption}
        </span>
      )}
    </div>
  );
}
