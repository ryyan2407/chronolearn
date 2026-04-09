import type { PropsWithChildren } from "react";

import { cn } from "../../lib/utils";

type PageContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function PageContainer({ className, children }: PageContainerProps) {
  return <div className={cn("mx-auto w-full max-w-7xl px-6 py-10", className)}>{children}</div>;
}
