```tsx
import { useRef, useState } from "react";
import {
  File,
  FileText,
  Image,
  UploadCloud,
  X,
} from "lucide-react";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
  error?: string;
}

const DEFAULT_ACCEPTED_TYPES = [
  ".txt",
  ".log",
  ".json",
  ".md",
  ".csv",
  ".png",
  ".jpg",
  ".jpeg",
];

function FileUpload({
  files,
  onChange,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  disabled = false,
  error,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("text/")) return FileText;
    return File;
  };

  const isAllowedFile = (file: File) => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    return acceptedTypes.some(
      (type) => type.toLowerCase() === extension,
    );
  };

  const addFiles = (selectedFiles: FileList | File[]) => {
    if (disabled) return;

    setValidationError("");

    const incomingFiles = Array.from(selectedFiles);
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of incomingFiles) {
      if (!isAllowedFile(file)) {
        errors.push(`${file.name}: unsupported file type.`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        errors.push(`${file.name}: exceeds ${maxSizeMB} MB.`);
        continue;
      }

      const alreadyExists = files.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified,
      );

      if (!alreadyExists) {
        validFiles.push(file);
      }
    }

    const remainingSlots = Math.max(0, maxFiles - files.length);
    const acceptedFiles = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      errors.push(`You can attach a maximum of ${maxFiles} files.`);
    }

    if (acceptedFiles.length > 0) {
      onChange([...files, ...acceptedFiles]);
    }

    if (errors.length > 0) {
      setValidationError(errors.join(" "));
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    if (disabled) return;
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
    setValidationError("");
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (!disabled) {
      addFiles(event.dataTransfer.files);
    }
  };

  const displayError = error || validationError;

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        disabled={disabled}
        className="hidden"
        onChange={(event) => {
          if (event.target.files) {
            addFiles(event.target.files);
          }
        }}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={[
          "rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border bg-elevated/30 hover:border-primary/50",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        ].join(" ")}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Choose files to attach"
        onKeyDown={(event) => {
          if (
            !disabled &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <UploadCloud
          size={30}
          className="mx-auto text-primary"
          aria-hidden="true"
        />

        <p className="mt-3 text-sm font-medium text-foreground">
          Drop files here or{" "}
          <span className="text-primary">browse</span>
        </p>

        <p className="mt-2 text-xs text-muted">
          Maximum {maxFiles} files, up to {maxSizeMB} MB each
        </p>

        <p className="mt-1 text-xs text-muted">
          Supported: {acceptedTypes.join(", ")}
        </p>
      </div>

      {displayError && (
        <p role="alert" className="text-sm text-danger">
          {displayError}
        </p>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Selected files ({files.length}/{maxFiles})
          </p>

          {files.map((file, index) => {
            const Icon = getFileIcon(file);

            return (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
              >
                <Icon
                  size={19}
                  className="shrink-0 text-primary"
                  aria-hidden="true"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted">
                    {formatSize(file.size)}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
```
