import { cn } from "@/lib/utils";

export const CardShineEffect = ({ className }: { className?: string }) => {
  return (
    <div className={cn("pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100", className)}>
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10"
        style={{
          maskImage: "radial-gradient(180px at var(--mouse-x, 0) var(--mouse-y, 0), white, transparent)",
          WebkitMaskImage: "radial-gradient(180px at var(--mouse-x, 0) var(--mouse-y, 0), white, transparent)",
        }}
      />
    </div>
  );
};