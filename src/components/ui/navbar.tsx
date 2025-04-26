import { cn } from "@/lib/utils";
import { Badge, badgeVariants } from "./badge";
import { Button } from "./button";

export const Navbar = () => {
  return (
    <header className="w-full flex items-baseline justify-between p-5 bg-card">
      {/* logo area */}
      <Badge
        variant={"outline"}
        className={cn("flex gap-1 text-2xl select-none p-2.5")}
      >
        <span className="font-medium text-primary">{">"}</span>
        <span className="font-bold">devfolio.</span>
      </Badge>

      {/* Convinience links */}
      <nav
        className={cn(
          "hidden sm:flex w-max gap-5 *:text-xl *:p-2.5 *:transition-all *:duration-500 [&_a]:hover:text-accent"
        )}
      >
        <a href="#link">Link</a>
        <a href="#link">Link</a>
        <a href="#link">Link</a>
        <a href="#link">Link</a>
      </nav>

      {/* contact me */}
      <Button className="hover:bg-secondary duration-300 hover:text-secondary-foreground">
        Contact
      </Button>
    </header>
  );
};
