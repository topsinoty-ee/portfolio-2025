import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ArrowRight, Users } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "wouter";
import { Project } from "@/generated/graphql";
import clsx from "clsx";

interface BaseProjectCardProps extends Project {
  title: string;
  description?: string;
  tags: string[];
  repo: string;
  link?: string;
  className?: string;
}

interface SoloProjectProps extends BaseProjectCardProps {
  solo: true;
}

interface TeamProjectProps extends BaseProjectCardProps {
  solo?: false;
  groupDescription?: ReactNode;
}

type ProjectCardProps = SoloProjectProps | TeamProjectProps;

export const ProjectCard = ({
  title,
  description,
  tags,
  link,
  repo,
  solo = false,
  // groupDescription,
  className,
  ...props
}: ProjectCardProps) => {
  return (
    <Link to={`/projects/${props.id}`} className={"z-32"}>
      <Card
        className={clsx(
          "bg-card/90 group/projCard transition-all duration-300 transform hover:shadow-primary hover:-translate-y-1 overflow-hidden",
          className,
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between gap-2 text-lg font-semibold group-hover/projCard:text-accent">
            <span className="line-clamp-1">{title}</span>
            {!solo && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="shrink-0">
                      <Users size={16} />
                    </Badge>
                  </TooltipTrigger>
                  {/*<TooltipContent>{groupDescription || "Team Project"}</TooltipContent>*/}
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
          {description && <CardDescription className="line-clamp-2">{description}</CardDescription>}
        </CardHeader>

        <CardContent className="pt-0 pb-4">
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs rounded-md px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-start gap-2.5 flex-wrap pt-0">
          {link && (
            <Button
              variant="ghost"
              size="default"
              className="group/link-btn text-sm px-3"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(link, "_blank", "noopener,noreferrer");
              }}
            >
              <span className="mr-1">View Project</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover/link-btn:translate-x-1" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="default"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              window.open(repo, "_blank", "noopener,noreferrer");
            }}
            className="group/repo-btn text-sm px-3"
          >
            <span className="mr-1">View Repo</span>
            {!link ? (
              <ArrowRight size={16} className="transition-transform duration-300 group-hover/repo-btn:translate-x-1" />
            ) : (
              <SiGithub size={16} />
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
