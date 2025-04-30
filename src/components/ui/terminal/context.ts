import { createContext, ReactNode } from "react";

export type CommandEntry = {
  command: string;
  output: ReactNode;
  timestamp: Date;
};

interface TerminalContextConfig {
  history: CommandEntry[];
  addCommand: (command: string, output: ReactNode) => void;
  user: string;
  host: string;
}

export const TerminalContext = createContext<TerminalContextConfig | undefined>(undefined);
