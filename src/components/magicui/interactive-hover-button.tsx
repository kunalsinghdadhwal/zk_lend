import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-[180px] cursor-pointer overflow-hidden rounded-xl border bg-background px-6 py-[9px] text-center font-semibold",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="h-2 w-2 bg-primary transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span className="inline-flex items-center transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-2 translate-x-12 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-0 group-hover:opacity-100">
        <span className="inline-flex items-center gap-2">
          {children}
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
