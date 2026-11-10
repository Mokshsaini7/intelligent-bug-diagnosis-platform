```tsx
interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
  lines?: number;
  className?: string;
}

function Skeleton({
  variant = "rectangular",
  width,
  height,
  lines = 1,
  className = "",
}: SkeletonProps) {
  const baseStyles =
    "animate-pulse bg-elevated";

  if (variant === "text") {
    return (
      <div
        className={`flex flex-col gap-2 ${className}`}
        aria-hidden="true"
      >
        {Array.from({ length: Math.max(1, lines) }).map((_, index) => (
          <div
            key={index}
            className={`${baseStyles} h-3 rounded-md`}
            style={{
              width: index === lines - 1 && lines > 1 ? "75%" : width || "100%",
              height,
            }}
          />
        ))}
      </div>
    );
  }

  const shapeStyles =
    variant === "circular"
      ? "rounded-full"
      : "rounded-xl";

  return (
    <div
      aria-hidden="true"
      className={`${baseStyles} ${shapeStyles} ${className}`}
      style={{
        width: width || (variant === "circular" ? "40px" : "100%"),
        height: height || (variant === "circular" ? "40px" : "80px"),
      }}
    />
  );
}

export default Skeleton;
```
