import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Flashlight, FlashlightOff } from "lucide-react";
import { useFlashLightContext } from "../ui/flashlightContext";

export const Navbar = () => {
  const { toggle, enabled } = useFlashLightContext();
  return (
  <header className="w-full flex items-baseline justify-between p-5 max-h-25 bg-card sticky z-50 top-0">
    {/* logo area */}
    <TooltipProvider delayDuration={3000}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={"outline"}
            className={cn(
              "flex gap-1 cursor-pointer text-2xl select-none p-2.5 hover:"
            )}
          >
            <span className="font-medium text-primary">{">"}</span>
            <span className="font-bold">devfolio.</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Portfolio 2025</TooltipContent>
      </Tooltip>
    </TooltipProvider>

    {/* Convenience links */}
    <nav
      className={cn(
        "hidden absolute top-0 left-1/2 -translate-x-1/2 translate-y-1/2 sm:flex w-max *:text-xl *:p-2.5 *:transition-all *:duration-500 [&_a]:hover:text-accent"
      )}
    >
      <a href="#link">Link</a>
      <a href="#link">Link</a>
      <a href="#link">Link</a>
      <a href="#link">Link</a>
    </nav>

      {/* contact me and controls */}
      <div className="flex gap-5">
        <Button onClick={toggle} className={cn("hidden sm:block hover:bg-secondary")} variant={"ghost"}>
          {enabled ? <Flashlight /> : <FlashlightOff />}
    </Button>
  </header>
);
};
