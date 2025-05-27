import { ReactNode } from "react";
import { useTerminal } from "../hook";
import { Terminal } from "../provider";

export function CLI({ prompt, children }: { prompt?: ReactNode; children?: ReactNode }) {
  const { user, host } = useTerminal();
  return (
    <>
      <div className="flex items-baseline text-primary">
        <span className="text-primary mr-2.5">~$</span>
        <span className="text-accent">{`${user}@${host}`}</span>
        <span className="text-secondary">:</span>
      </div>
      <div className="inline-flex">
        {children || prompt || null}
        <Terminal.Cursor />
      </div>
    </>
  );
}
