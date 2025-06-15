import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Globe, Users } from "lucide-react";
import { Link } from "wouter";
import { GetFeaturedProjectsQuery } from "@/generated/graphql";
import { cn } from "@/lib/utils.ts";

interface FeaturedProjectCardProps
  extends Omit<GetFeaturedProjectsQuery["projects"][number], "__typename" | "skillsRequired"> {
  tags: string[];
  className?: string;
}

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
    <Link to={`/projects/${id}`} className={"z-32"}>
      <Card
        className={cn(
          "bg-card/90 group/projCard transition-all delay-300 duration-300 transform hover:shadow-primary hover:-translate-y-1 overflow-hidden",
          className,
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-semibold">
            <span className="line-clamp-1 group-hover/projCard:text-secondary">
              {title.slice(0, 1).toUpperCase() + title.slice(1, title.length)}
            </span>
            <div className="flex items-center gap-2">
              {!!repo && (
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(repo, "_blank", "noopener,noreferrer");
                  }}
                >
                  <SiGithub size={16} />
                </Button>
              )}
              {!!link && (
                <Badge variant="outline" className="shrink-0 aspect-square">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.open(link, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <Globe size={16} className="text-muted-foreground hover:text-accent transition-colors" />
                  </Button>
                </Badge>
              )}
              {!!collaborators.length && (
                <Badge variant="outline" className="shrink-0 aspect-square">
                  <Users size={16} />
                </Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {!description ? "no description set" : description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap max-h-24 gap-2 overflow-y-auto">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs rounded-md">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
