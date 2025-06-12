import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/projectCard";
import { SectionHeader } from "@/components/ui/sectionHeader";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useGetFeaturedProjectsSuspenseQuery } from "@/generated/graphql";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

const ProjectsList = () => {
  const { data, error } = useGetFeaturedProjectsSuspenseQuery();

  if (error) {
    return (
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertDescription>Failed to load projects: {error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!data?.projects?.length) {
    return <div className="text-muted-foreground">No projects found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-10">
      {data.projects.map((project) => (
        <ProjectCard
          {...project}
          key={project.id}
          title={project.title}
          // description={project.description}
          tags={project.skillsRequired}
          link={project.link || undefined}
          repo={project.repo ?? ""}
        />
      ))}
    </div>
  );
};

export const MyProjects = () => {
  return (
    <section
      id="projects"
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

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-10">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-lg bg-muted" />
              ))}
            </div>
          }
        >
          <ProjectsList />
        </Suspense>
      </div>

      <div className="w-full flex items-center justify-center">
        <Button variant={"outline"} asChild>
          <a href="https://github.com/topsinoty-ee?tab=repositories" target={"_blank"} rel={"noopener noreferrer"}>
            <SiGithub />
            My repos
          </a>
        </Button>
      </div>
    </section>
  );
};
