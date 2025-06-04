import { Badge } from "../ui/badge";
import { SectionHeader } from "../ui/sectionHeader";
import { Socials } from "../ui/socials";

export const Footer = () => (
  <footer className="relative w-full gap-5 justify-between flex flex-col md:flex-row p-10 md:p-20 bg-card border-t-border border-t max-h-80 h-max drop-shadow-xs drop-shadow-border backdrop-blur-lg z-50">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <SectionHeader className="gap-0 select-none w-max">
            Devfolio<span className="text-secondary">.v25</span>
          </SectionHeader>
          <p className="font-light text-muted-foreground">Basic portfolio to show my skills</p>
        </div>
        <Socials />
      </div>
      <Badge variant={"secondary"} className="rounded-full">
        © 2025 <a href="https://github.com/topsinoty-ee/portfolio-2025">@topsinoty-ee</a>. All rights reserved.
      </Badge>
    </div>
    <div className="md:flex items-end justify-end self-end hidden bg-black h-full w-1/2">
      <Badge variant="outline" className="text-lg drop-shadow-xs drop-shadow-accent bg-card px-4 py-2.5">
        Find me online @topsinoty
      </Badge>
    </div>
  </footer>
);
