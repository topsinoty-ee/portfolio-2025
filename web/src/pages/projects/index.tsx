import { GetProjectsQuery, useGetProjectsQuery } from "@/generated/graphql";
import { Loader2, TriangleAlert, Wrench } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "wouter";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { AiFillStar } from "react-icons/ai";

const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const ProjectCard: FC<GetProjectsQuery["projects"][number]> = memo(
  ({ title, description, link, repo, skillsRequired, id, isFeatured }) => (
    <div className="break-inside-avoid mb-4 bg-background/90 backdrop-blur-2xl rounded-lg shadow-sm hover:shadow-md transition-all duration-500 drop-shadow-accent hover:drop-shadow-2xl group">
      <Link
        to={`/projects/${id}`}
        className="block p-4 border hover:border-primary/30 transition-all duration-500 rounded-lg drop-shadow-accent backdrop-blur-2xl hover:drop-shadow-2xl shadow-sm hover:shadow-md w-full"
      >
        <h2 className="text-xl font-semibold leading-snug inline-flex items-center-safe gap-1">
          {title}{" "}
          {isFeatured && (
            <AiFillStar className={"antialiased text-primary size-4 inline-block group-hover:animate-pulse"} />
          )}
        </h2>
        <p className="text-xs text-muted-foreground italic">{description}</p>
        <Separator className="my-2" />
        <div className="text-xs text-muted-foreground flex flex-col gap-1">
          <div className="flex gap-2 flex-wrap">
            {skillsRequired && (
              <div className="flex flex-wrap gap-1">
                {skillsRequired.map((skill) => (
                  <span key={skill} className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            {link && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openInNewTab(link);
                }}
                className="text-blue-500 hover:underline"
                variant="link"
                title={"Open live demo"}
              >
                <Wrench className="size-4" />
              </Button>
            )}
            {repo && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openInNewTab(repo);
                }}
                className="text-blue-500 hover:underline"
                variant="link"
                title={"View source code"}
              >
                <SiGithub className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  ),
);
ProjectCard.displayName = "ProjectCard";

const MasonryGrid: FC<{ children: React.ReactNode; columns?: number }> = memo(({ children, columns = 3 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(columns);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      if (width < 640) {
        setColumnCount(1);
      } else if (width < 768) {
        setColumnCount(2);
      } else if (width < 1024) {
        setColumnCount(3);
      } else {
        setColumnCount(4);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return (
    <div
      ref={containerRef}
      className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-0"
      style={{
        columnCount: columnCount,
        columnGap: "1rem",
      }}
    >
      {children}
    </div>
  );
});
MasonryGrid.displayName = "MasonryGrid";

const ProjectCards: FC<GetProjectsQuery & { type?: "list" | "masonry" }> = memo(({ projects, type = "masonry" }) => (
  <section>
    <div>{/* Search bar */}</div>
    <div>
      {type === "masonry" ? (
        <MasonryGrid>
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </MasonryGrid>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      )}
    </div>
  </section>
));
ProjectCards.displayName = "ProjectCards";

export const ProjectsPage = () => {
  const { data, error, loading } = useGetProjectsQuery();
  const projects = data?.projects || [];

  return (
    <div className="flex flex-col gap-10 w-full h-full">
      <div className="flex flex-col md:items-center justify-between">
        <h1 className="text-4xl font-bold leading-loose bg-gradient-to-r from-accent/90 to-135% to-muted/60 dark:from-muted/10 dark:to-muted/40 text-transparent bg-clip-text">
          Projects
        </h1>
        <p className="text-sm italic text-muted-foreground font-medium">My public projects...some have stories</p>
      </div>
      <section>
        {error && (
          <Alert variant="destructive">
            <TriangleAlert className="size-4" />
            <AlertDescription>Error loading projects: {error.message}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin size-12" />
          </div>
        ) : projects.length ? (
          <ProjectCards
            projects={[
              ...projects,
              projects[1],
              ...projects,
              projects[1],
              ...projects,
              projects[1],
              ...projects,
              projects[1],
            ]}
          />
        ) : (
          <Alert>
            <TriangleAlert className="size-4" />
            <AlertDescription>No projects found.</AlertDescription>
          </Alert>
        )}
      </section>
    </div>
  );
};
