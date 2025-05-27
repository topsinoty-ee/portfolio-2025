import { Terminal } from "../ui/terminal";

export const DisplayTerminal = () => (
  <Terminal
    user="guest"
    host="devfolio/2025"
    welcomeMessage={
      <Terminal.Output>
        <span>🌟 Welcome to Interactive Portfolio CLI v1.0.0</span>
        <span>Type 'help' to see available commands</span>
      </Terminal.Output>
    }
    className="w-full max-w-3xl"
  >
    <Terminal.History />
    <Terminal.CLI />
  </Terminal>
);
