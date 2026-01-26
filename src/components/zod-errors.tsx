import { cn } from "@/lib/utils";

export function ZodErrors({ err, className }: { err?: string[], className?: string }) {
  if (!err || err.length === 0) return null;
  return (
    <>
      {err.map((e, idx) => (
        <div key={idx}
          className={cn(
            "text-red-500 text-sm italic",
            className
          )}>
          {e}
        </div>
      ))}
    </>
  );
}