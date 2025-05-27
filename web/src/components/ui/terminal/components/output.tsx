import { ComponentProps, ReactNode } from "react";

export function Output({ children, ...divProps }: { children: ReactNode } & ComponentProps<"div">) {
  return (
    <div className="text-popover-foreground flex flex-col gap-2" {...divProps}>
      {children}
    </div>
  );
}
