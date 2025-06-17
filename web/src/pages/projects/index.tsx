import { GetProjectsQuery, useGetProjectsQuery } from "@/generated/graphql";
import { ExternalLink, Grid, List, Loader2, Search, Star, TriangleAlert, User, Users, Wrench } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Link } from "wouter";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { format } from "date-fns";

const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const ProjectCard: FC<GetProjectsQuery["projects"][number]> = memo(
  ({ title, description, link, repo, skillsRequired, id, isFeatured, collaborators, updatedAt }) => {
    const formattedDate = format(new Date(updatedAt), "MMM dd, yyyy");

    return (
      <div className="break-inside-avoid mb-6 group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />

        <div className="relative bg-card/95 backdrop-blur-xl rounded-xl border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
          {isFeatured && (
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400/90 to-amber-500/90 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                <Star className="size-3 fill-current" />
                Featured
              </div>
            </div>
          )}

          <Link to={`/projects/${id}`} className="block p-6 hover:bg-accent/5 transition-all duration-300">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{description}</p>
            </div>

            {skillsRequired && skillsRequired.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {skillsRequired.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="bg-gradient-to-r from-accent/10 to-accent/20 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium border border-accent/20 hover:border-accent/40 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {skillsRequired.length > 4 && (
                    <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted/20">
                      +{skillsRequired.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <Separator className="my-4 opacity-50" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  {collaborators.length > 0 ? (
                    <>
                      <Users className="size-3" />
                      <span>
                        {collaborators.length} collaborator{collaborators.length === 1 ? "" : "s"}
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="size-3" />
                      <span>Personal</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span>{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {link && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openInNewTab(link);
                    }}
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                    title="View live demo"
                  >
                    <ExternalLink className="size-4" />
                  </Button>
                )}
                {repo && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openInNewTab(repo);
                    }}
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                    title="View source code"
                  >
                    <SiGithub className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  },
);
ProjectCard.displayName = "ProjectCard";

const MasonryGrid: FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      if (width < 640) {
        setColumnCount(1);
      } else if (width < 1024) {
        setColumnCount(2);
      } else if (width < 1280) {
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
      className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6"
      style={{
        columnCount: columnCount,
        columnGap: "1.5rem",
      }}
    >
      {children}
    </div>
  );
});
MasonryGrid.displayName = "MasonryGrid";

const ProjectCards: FC<GetProjectsQuery & { type?: "list" | "masonry"; searchTerm?: string }> = memo(
  ({ projects, type = "masonry", searchTerm = "" }) => {
    const filteredProjects = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.skillsRequired?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    const featuredProjects = filteredProjects.filter((p) => p.isFeatured);
    const regularProjects = filteredProjects.filter((p) => !p.isFeatured);
    const sortedProjects = [...featuredProjects, ...regularProjects];

    if (sortedProjects.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/20 rounded-full mb-4">
            <Search className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground text-sm">
            {searchTerm ? `No projects match "${searchTerm}"` : "No projects available"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {featuredProjects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Star className="size-5 text-yellow-500 fill-current" />
              <h2 className="text-lg font-semibold">Featured Projects</h2>
            </div>
            {type === "masonry" ? (
              <MasonryGrid>
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </MasonryGrid>
            ) : (
              <div className="grid gap-6">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            )}
          </div>
        )}

        {regularProjects.length > 0 && (
          <div>
            {featuredProjects.length > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-lg font-semibold">All Projects</h2>
                <span className="text-sm text-muted-foreground">({regularProjects.length})</span>
              </div>
            )}
            {type === "masonry" ? (
              <MasonryGrid>
                {regularProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </MasonryGrid>
            ) : (
              <div className="grid gap-6">
                {regularProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
ProjectCards.displayName = "ProjectCards";

export const ProjectsPage = () => {
  const { data, error, loading } = useGetProjectsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"list" | "masonry">("masonry");
  const projects = data?.projects || [];

  return (
    <>
      <div className="container px-4 py-8 min-h-screen flex flex-col">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-8">
              <Wrench className="size-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-secondary/40 to-primary text-transparent bg-clip-text leading-snug">
              Projects
            </h1>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 backdrop-blur-sm"
            />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={viewType === "masonry" ? "default" : "outline"}
              onClick={() => setViewType("masonry")}
              className="flex items-center gap-2"
            >
              <Grid className="size-4" />
              Grid
            </Button>
            <Button
              variant={viewType === "list" ? "default" : "outline"}
              onClick={() => setViewType("list")}
              className="flex items-center gap-2"
            >
              <List className="size-4" />
              List
            </Button>
          </div>
        </div>

        <div className="relative">
          {error && (
            <Alert variant="destructive" className="mb-8">
              <TriangleAlert className="size-4" />
              <AlertDescription>Failed to load projects. Please try again later.</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin size-12 text-primary mb-4" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : (
            <ProjectCards projects={projects} type={viewType} searchTerm={searchTerm} />
          )}
        </div>
      </div>
    </>
  );
};
