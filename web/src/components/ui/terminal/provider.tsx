import { useState, ReactNode, ComponentProps } from "react";
import { CommandEntry, TerminalContext } from "./context";
import { Header } from "./components/header";
import { Controls } from "./components/controls";
import { Output } from "./components/output";
import { CLI } from "./components/cli";
import { Cursor } from "./components/cursor";
import { History } from "./components/history";

export interface TerminalProps extends ComponentProps<"div"> {
  user?: string;
  host?: string;
  welcomeMessage?: ReactNode;
}

export const Terminal = ({
  className = "",
  children,
  user = "visitor",
  host = "portfolio",
  welcomeMessage,
}: TerminalProps) => {
  const [history, setHistory] = useState<CommandEntry[]>([]);

  const addCommand = (command: string, output: ReactNode) => {
    setHistory((prev) => [
      ...prev,
      {
        command,
        output,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <TerminalContext.Provider value={{ history, addCommand, user, host }}>
      <div className={`font-mono bg-popover rounded-2xl overflow-hidden ${className}`}>
        <Terminal.Header>
          <Terminal.Controls />
          <span className="text-sm text-secondary">bash</span>
        </Terminal.Header>

        <div className="p-5 h-96 overflow-y-auto flex flex-col gap-5 text-sm">
          {welcomeMessage || (
            <Terminal.Output>Welcome to the terminal! Type 'help' for available commands</Terminal.Output>
          )}
          {children}
        </div>
      </div>
    </TerminalContext.Provider>
  );
};

Terminal.Header = Header;
Terminal.Controls = Controls;
Terminal.Output = Output;
Terminal.CLI = CLI;
Terminal.Cursor = Cursor;
Terminal.History = History;
