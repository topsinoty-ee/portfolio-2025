"use client";

import { useState } from "react";
import type { PrismTheme } from "prism-react-renderer";
import { Highlight } from "prism-react-renderer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";

const codeTheme: PrismTheme = {
  plain: {
    color: "var(--foreground)",
    backgroundColor: "var(--editor-background)",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "var(--muted-foreground)",
        fontStyle: "italic",
      },
    },
    {
      types: ["namespace"],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ["string", "attr-value", "char", "regex-literal"],
      style: {
        color: "var(--success)",
      },
    },
    {
      types: ["operator"],
      style: {
        color: "var(--accent)",
      },
    },
    {
      types: ["builtin", "inserted"],
      style: {
        color: "var(--success)",
        fontStyle: "italic",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["entity", "url", "symbol", "number", "boolean", "constant", "property", "inserted"],
      style: {
        color: "var(--chart-4)",
      },
    },
    {
      types: ["variable", "language-variable"],
      style: {
        color: "var(--chart-3)",
      },
    },
    {
      types: ["atrule", "keyword", "attr-name", "selector"],
      style: {
        color: "var(--chart-2)",
      },
    },
    {
      types: ["function", "method"],
      style: {
        color: "var(--chart-1)",
      },
    },
    {
      types: ["deleted", "tag"],
      style: {
        color: "var(--destructive)",
      },
    },
    {
      types: ["function-variable"],
      style: {
        color: "var(--chart-5)",
      },
    },
    {
      types: ["important", "bold"],
      style: {
        fontWeight: "bold",
      },
    },
    {
      types: ["italic"],
      style: {
        fontStyle: "italic",
      },
    },
    {
      types: ["class-name", "maybe-class-name"],
      style: {
        color: "var(--warning)",
      },
    },
  ],
};

interface EditorProps {
  initialCode?: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  title?: string;
  readOnly?: boolean;
}

export const Editor = ({
  initialCode = "",
  language = "typescript",
  showLineNumbers = true,
  className = "",
  title,
  readOnly = true,
}: EditorProps) => {
  const [code] = useState(initialCode.trim());
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(
      () => console.log("Copied to clipboard!"),
      () => console.log("Failed to copy to clipboard!")
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border flex flex-col max-h-full border-border bg-[--editor-background] shadow-md overflow-hidden",
        className
      )}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[--editor-header-background] border-b border-[--editor-header-border]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-warning/80" />
            <div className="w-3 h-3 rounded-full bg-success/80" />
          </div>
          {title && <span className="text-sm font-medium text-muted-foreground">{title}</span>}
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs font-medium text-muted-foreground tracking-wide cursor-help px-2 py-1 rounded bg-muted/40">
                {language.toUpperCase()}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{`Code Language: ${language}`}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"secondary"}
                onClick={copyToClipboard}
                className="p-1.5 rounded hover:bg-muted/40 transition-colors"
                aria-label="Copy code"
              >
                {isCopied ? (
                  <Check size={16} className="text-[--editor-copy-success]" />
                ) : (
                  <Copy size={16} className="text-muted-foreground" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isCopied ? "Copied!" : "Copy code"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Code Area */}
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-[--editor-scrollbar-thumb] scrollbar-track-[--editor-scrollbar-track] h-full">
        <Highlight language={language} code={code} theme={codeTheme}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={cn(
                className,
                "font-mono text-sm px-5 py-4 leading-relaxed whitespace-pre-wrap break-words", // Added whitespace-pre-wrap and break-words
                readOnly ? "select-text" : ""
              )}
              style={style}
            >
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className={cn("table-row", hoveredLine === i ? "bg-[--editor-line-highlight]" : "")}
                  onMouseEnter={() => setHoveredLine(i)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  {showLineNumbers && (
                    <span className="table-cell text-right pr-4 text-xs text-muted-foreground select-none">
                      {i + 1}
                    </span>
                  )}
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};
