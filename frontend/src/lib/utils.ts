```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names and resolves Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Capitalizes the first character of a string.
 */
export function capitalize(value: string): string {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Converts a string into a readable title.
 */
export function formatTitle(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(capitalize)
    .join(" ");
}

/**
 * Formats a date using the browser's locale.
 */
export function formatDate(
  value: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

/**
 * Returns a human-readable relative time.
 */
export function formatRelativeTime(value: string | Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 0) return "Just now";
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return formatDate(date);
}

/**
 * Safely extracts a readable error message.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

/**
 * Truncates long text without breaking short values.
 */
export function truncateText(
  value: string,
  maxLength = 100,
): string {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

/**
 * Converts bytes into a human-readable file size.
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 Bytes";
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const size = bytes / 1024 ** unitIndex;

  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

/**
 * Generates initials from a person's name.
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
```
