import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Globe, Star, Users } from "lucide-react";
import { Link } from "wouter";
import { GetFeaturedProjectsQuery } from "@/generated/graphql";
import { cn } from "@/lib/utils.ts";

interface FeaturedProjectCardProps
  extends Omit<GetFeaturedProjectsQuery["projects"][number], "__typename" | "skillsRequired"> {
  tags: string[];
  className?: string;
}

const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export const FeaturedProjectCard = ({
  id,
  title,
  description,
  tags,
  link,
  repo,
  collaborators,
  className,
}: FeaturedProjectCardProps) => {
  return (
    <div className="group relative">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />

      <div className="relative">
        <Link to={`/projects/${id}`}>
          <Card
            className={cn(
              "relative bg-card/95 backdrop-blur-sm border border-border hover:border-border/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:-translate-y-1",
              className,
            )}
          >
            {/* Featured badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium border border-primary/20">
                <Star className="size-3 fill-current" />
                Featured
              </div>
            </div>

            <div className="block p-6 hover:bg-secondary/5 transition-all duration-300">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-start justify-between text-xl font-bold">
                  <span className="line-clamp-2 group-hover:text-primary transition-colors duration-300 pr-4">
                    {title.slice(0, 1).toUpperCase() + title.slice(1, title.length)}
                  </span>
                </CardTitle>
                <CardDescription className="line-clamp-3 leading-relaxed text-sm text-muted-foreground">
                  {!description ? "No description set" : description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {/* Tags section */}
                {tags && tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                      {tags.slice(0, 6).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-muted/50 text-foreground px-3 py-1 rounded-full text-xs font-medium border border-border hover:border-border/80 transition-colors duration-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {tags.length > 6 && (
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted/20"
                        >
                          +{tags.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Separator */}
                <div className="border-t border-border/50 my-4" />

                {/* Footer section */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      {collaborators.length > 0 ? (
                        <>
                          <Users className="size-3 shrink-0" />
                          <span className="ml-1 truncate">
                            {collaborators.length} collaborator{collaborators.length === 1 ? "" : "s"}
                          </span>
                        </>
                      ) : (
                        <>
                          <Users className="size-3 shrink-0 opacity-50" />
                          <span className="ml-1 truncate opacity-50">Solo project</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
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
                        <Globe className="size-4" />
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
              </CardContent>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};
