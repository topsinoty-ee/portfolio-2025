import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Flashlight, FlashlightOff } from "lucide-react";
import { useFlashLightContext } from "../ui/flashlightContext";

export const Navbar = () => {
  const { toggle, enabled } = useFlashLightContext();
  return (
    <header className="w-full flex items-baseline justify-between px-10 md:px-20 p-5 max-h-25 bg-card/80 drop-shadow-xs drop-shadow-border backdrop-blur-lg sticky z-50 top-0">
      {/* logo area */}
      <TooltipProvider delayDuration={3000}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={"outline"} className={cn("flex gap-1 cursor-pointer text-2xl select-none p-2.5 hover:")}>
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
          "hidden absolute top-0 left-1/2 -translate-x-1/2 translate-y-1/2 md:flex w-max *:text-xl *:p-2.5 *:transition-all *:duration-500 [&_a]:hover:text-accent"
        )}
      >
        <a href="#myProjects">Projects</a>
        <a href="#aboutMe">Me</a>
        <a href="#contactMe">Contact</a>
      </nav>

      {/* contact me and controls */}
      <div className="flex gap-5">
        <Button onClick={toggle} className={cn("hidden md:block hover:bg-secondary")} variant={"ghost"}>
          {enabled ? <Flashlight /> : <FlashlightOff />}
        </Button>
        <Button className="hover:bg-secondary duration-300 hover:text-secondary-foreground" asChild>
          <a href="#contactMe">Contact me</a>
        </Button>
      </div>
    </header>
  );
};
