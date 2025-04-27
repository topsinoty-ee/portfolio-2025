import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-separator";

export const Navbar = () => (
  <header className="w-full flex items-baseline justify-between p-5 max-h-25 bg-card sticky z-50 top-0">
    {/* logo area */}
    <Badge
      variant={"outline"}
      className={cn("flex gap-1 text-2xl select-none p-2.5 hover:")}
    >
      <span className="font-medium text-primary">{">"}</span>
      <span className="font-bold">devfolio. '25</span>
    </Badge>

    {/* Convinience links */}
    <nav
      className={cn(
        "hidden sm:flex space-x-2.5 w-max *:text-xl *:p-2.5 *:transition-all *:duration-500 [&_a]:hover:text-accent"
      )}
    >
      <a href="#link">Link</a>
      <Separator className="" orientation="vertical" />
      <a href="#link">Link</a>
      <Separator orientation="vertical" />
      <a href="#link">Link</a>
      <Separator orientation="vertical" />
      <a href="#link">Link</a>
    </nav>

    {/* contact me */}
    <Button className="hover:bg-secondary duration-300 hover:text-secondary-foreground">
      Contact
    </Button>
  </header>
);
