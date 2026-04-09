import * as React from "react";

import { cn } from "../../lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full rounded-[24px] border border-input bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-200",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
