import { GetProjectsQuery, useGetProjectsQuery } from "@/generated/graphql";
import {
  Building2,
  ExternalLink,
  Grid,
  List,
  Loader2,
  Search,
  Star,
  TriangleAlert,
  User,
  Users,
  Wrench,
} from "lucide-react";
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

export const ProjectCard: FC<Omit<GetProjectsQuery["projects"][number], "updatedAt"> & { updatedAt?: string }> = memo(
  ({ title, description, link, repo, for: forWho, skillsRequired, id, isFeatured, collaborators, updatedAt }) => {
    const formattedDate = updatedAt && format(new Date(updatedAt), "MMM dd, yyyy");

    return (
      <div className="break-inside-avoid mb-6 group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-border/50 to-border/50 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />

        <div className="relative bg-card backdrop-blur-sm rounded-xl border border-border hover:border-border/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          {isFeatured && (
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
                <Star className="size-3 fill-current" />
                Featured
              </div>
            </div>
          )}

          <Link to={`/projects/${id}`} className="block p-6 hover:bg-secondary/5 transition-all duration-300">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-2 transition-colors duration-300">
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
                      className="bg-muted/50 text-foreground px-3 py-1 rounded-full text-xs font-medium border border-border hover:border-border/80 transition-colors duration-200"
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

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  {forWho ? (
                    <>
                      <Building2 className="size-3 shrink-0" />
                      <span className="ml-1 truncate text-ellipsis overflow-hidden">
                        {forWho}
                        {collaborators.length > 0 && (
                          <>
                            {" "}
                            ({collaborators.length} collaborator{collaborators.length === 1 ? "" : "s"})
                          </>
                        )}
                      </span>
                    </>
                  ) : collaborators.length > 0 ? (
                    <>
                      <Users className="size-3 shrink-0" />
                      <span className="ml-1 truncate text-ellipsis overflow-hidden">
                        {collaborators.length} collaborator{collaborators.length === 1 ? "" : "s"}
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="size-3 shrink-0" />
                      <span className="ml-1 truncate text-ellipsis overflow-hidden">Personal</span>
                    </>
                  )}
                </div>
                {formattedDate && (
                  <div className="flex items-center gap-1 shrink-0">
                    <span>{formattedDate}</span>
                  </div>
                )}
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
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-muted hover:text-foreground"
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
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-muted hover:text-foreground"
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
        project.skillsRequired?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.collaborators?.some((collaborator) => collaborator.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    const sortedProjects = [...filteredProjects].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });

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
      <div className=" flex flex-col gap-6 ">
        <h2 className="text-lg font-semibold">All Projects ({sortedProjects.length})</h2>

        {type === "masonry" ? (
          <MasonryGrid>
            {sortedProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </MasonryGrid>
        ) : (
          <div className="grid gap-6">
            {sortedProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-muted/20 rounded-2xl">
              <Wrench className="size-8 text-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground mt-1">My collection of projects and experiments</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
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
    </div>
  );
};
