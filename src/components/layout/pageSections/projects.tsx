import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/projectCard";
import { SectionHeader } from "@/components/ui/sectionHeader";
import { SiGithub } from "@icons-pack/react-simple-icons";

export const MyProjects = () => (
  <section
    id="myProjects"
    className="w-full flex flex-col gap-15 md:gap-20 h-full items-center min-h-[calc(100vh-10rem)]"
  >
    <div className="gap-10 flex flex-col w-full">
      <div className="flex items-center flex-col gap-2.5 text-center">
        <Badge className="select-none" variant={"default"}>
          Project showcase
        </Badge>
        <div>
          <SectionHeader type="secondary">Featured Projects</SectionHeader>
          <p className="font-light text-sm md:text-lg text-muted-foreground">
            Just a collection of projects to show my skills.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-10">
        <ProjectCard
          title={"Flave"}
          description="A recipe search engine"
          tags={["typescript", "next.js", "API", "full-stack"]}
          link={"https://flave.ee"}
          repo={"https://github.com/topsinoty-ee/flave"}
          groupDescription={
            <p className="text-center">
              Team Project. see:{" "}
              <a href="https://github.com/flave-ee" target="_blank" rel="noopener noreferrer">
                @flave
              </a>
            </p>
          }
        />
      </div>
    </div>

    <div className="w-full flex items-center justify-center">
      <Button variant={"outline"} asChild>
        <a href="https://github.com/topsinoty-ee?tab=repositories">
          <SiGithub />
          My repos
        </a>
      </Button>
    </div>
  </section>
);
