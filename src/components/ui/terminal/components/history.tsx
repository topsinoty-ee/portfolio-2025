import { useTerminal } from "../hook";
import { Terminal } from "../provider";

export function History() {
  const { history } = useTerminal();
  return (
    <>
      {history.map((entry, idx) => (
        <div key={idx} className="flex flex-col">
          <Terminal.CLI>
            <span className="text-popover-foreground">{entry.command}</span>
          </Terminal.CLI>
          <Terminal.Output>{entry.output}</Terminal.Output>
        </div>
      ))}
    </>
  );
}
