import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Flashlight, FlashlightOff } from "lucide-react";
import { useFlashLightContext } from "../ui/flashlightContext";
import { Link, useLocation } from "wouter";

export const Navbar = () => {
  const { toggle, enabled } = useFlashLightContext();
  const [location] = useLocation();

  enum RouteTitle {
    Home = "Home",
    Projects = "ViewMyProjects",
    Me = "Me",
    Contact = "GetInTouch",
  }

  interface RouteMapping {
    [key: string]: RouteTitle;
  }

  const ROUTE_TO_TITLE_MAP: RouteMapping = {
    "/": RouteTitle.Home,
    "/projects": RouteTitle.Projects,
    "#me": RouteTitle.Me,
    "/contact-me": RouteTitle.Contact,
  } as const;

  const getRouteTitle = (path: string): RouteTitle => {
    return ROUTE_TO_TITLE_MAP[path] ?? RouteTitle.Home;
  };
  return (
    <header className="w-full flex items-baseline justify-between px-10 md:px-20 p-5 max-h-25 bg-card/80 drop-shadow-xs drop-shadow-border backdrop-blur-lg sticky z-50 top-0">
      <Link to={"/"}>
        <TooltipProvider delayDuration={600}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={"outline"} className={cn("flex gap-1 cursor-pointer text-2xl select-none p-2.5 hover:")}>
                <span className="font-medium text-primary">{"<"}</span>
                <span className="font-bold">{getRouteTitle(location)}</span>
                <span className="font-medium text-primary">{"/>"}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{location === "/" ? "Portfolio 2025" : "Go to home"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>

      <div className="flex items-center gap-5">
        <nav
          className={cn(
            "hidden md:flex w-max *:text-xl *:p-2.5 *:transition-all *:duration-500 [&_a]:hover:text-accent",
          )}
        >
          <Link to="/#projects">Projects</Link>
          <Link to="/#aboutMe">Me</Link>
          <Link to="/#contactMe">Contact</Link>
        </nav>
        <Button
          onClick={toggle}
          className={cn("hidden md:block hover:bg-secondary")}
          variant={"ghost"}
          aria-label={enabled ? "Disable flashlight" : "Enable flashlight"}
        >
          {enabled ? <Flashlight /> : <FlashlightOff />}
        </Button>
      </div>
    </header>
  );
};
