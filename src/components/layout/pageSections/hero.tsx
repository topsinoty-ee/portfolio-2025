import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/sectionHeader";
import { Button } from "@/components/ui/button";

export const Hero = () => (
  <section className="flex-col flex gap-0 md:gap-20 md:flex-row w-full max-h-max">
    <div className="w-full h-full min-h-96 order-1 flex flex-col gap-15 md:gap-10">
      <div className="flex flex-col gap-2 md:gap-2.5">
        <TooltipProvider delayDuration={10000}>
          <Tooltip>
            <TooltipTrigger className="bg-secondary text-secondary-foreground md:text-lg" asChild>
              <Badge className="rounded-2xl px-4">Frontend dev</Badge>
            </TooltipTrigger>
            <TooltipContent
              arrowClassName="fill-card bg-card text-card-foreground"
              className="bg-card text-card-foreground"
            >
              That likes to dabble ;p
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          <SectionHeader size="lg">Hi world!</SectionHeader>
          <h2 className="font-light text-xl md:text-2xl">
            I&apos;m <span className="font-semibold text-accent">Promise</span>, a developer that cares about
            maintainable code and scalable web solutions &#x1f64c;
          </h2>
        </div>
      </div>

      <div className="flex gap-2.5 md:gap-5 *:font-semibold">
        <Button variant={"secondary"}>Contact me</Button>
        <Button variant={"link"} className="text-secondary" asChild>
          <a href="#myProjects">View my projects</a>
        </Button>
      </div>
    </div>
    <div className="w-full h-full min-h-96 order-2 flex bg-accent place-items-center place-content-center">
      Terminal
    </div>
  </section>
);
