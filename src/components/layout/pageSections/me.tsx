import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/sectionHeader";
import { SkillBadgeList } from "@/components/ui/skillBadge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";

export const AboutMe = () => (
  <section id="aboutMe" className="w-full flex items-start flex-col md:flex-row gap-15 md:gap-20 h-full min-h-max">
    <div className="flex w-full flex-col h-max items-start gap-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge>Who am I?</Badge>
          </TooltipTrigger>
          <TooltipContent>
            <a href="https://www.youtube.com/watch?v=BBJa32lCaaY" target="_blank" rel="noopener noreferrer">
              {"¯\\_(ツ)_/¯"}
            </a>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SectionHeader type="info">You can call me Promise</SectionHeader>
      <p className="font-medium text-sm md:text-lg inline-flex  gap-2 flex-col ">
        <span className="text-muted-foreground">
          I&apos;m a frontend dev who loves dabbling across tech to build modular, scalable web experiences!
        </span>
        <span>
          I specialize in crafting clean, fast apps with modern JavaScript frameworks. I obsess over clean code, smart
          architecture, and seamless user experiences. When I&apos;m not coding, you&apos;ll find me either reading a
          really good book or or on the court 🏀
        </span>
      </p>
      <Button asChild className="group">
        <a href="/promise_temitope.pdf" target="_blank" rel="noopener noreferrer">
          My CV <ExternalLink className="group-hover:animate-in" />
        </a>
      </Button>
      <SkillBadgeList
        skills={{
          core: ["React", "Next.js", "TypeScript", "Node.js", "TailwindCSS"],
          tools: ["Git", "Figma", "Vitest", "Postman", "Apollo Client"],
          others: ["MongoDB", "Shadcn", "GraphQL", "Angular", "Flask", "Python", "Express.js", "Java", "nx"],
        }}
      />
    </div>

    <div className="p-1 border border-border rounded-lg overflow-hidden hover:drop-shadow-secondary duration-1000 bg-gradient-to-br from-muted/30 to-card w-full transition-all bg-popover/80 h-max drop-shadow-md drop-shadow-primary self-center relative">
      <div className="bg-card rounded-md p-5 flex flex-col h-full gap-5">
        <h3 className="text-xl font-bold">Quick Facts</h3>
        <ul className="flex flex-col gap-3">
          {[
            "Very curious developer",
            "Started when I was 13 and still growing",
            "I speak English, Estonian and Yoruba",
            "I know a bit about a lot, from frontend to backend, and everything in between",
            "I like building custom tools and libs that make development smoother",
          ].map((fact, idx) => (
            <li key={idx} className="flex items-start">
              <div className="size-7.5 aspect-square rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs">✓</span>
              </div>
              <span className="mt-1">{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
