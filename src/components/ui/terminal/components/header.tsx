import { ReactNode } from "react";

export function Header({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between px-4 py-2 border-b border-accent">{children}</div>;
}
