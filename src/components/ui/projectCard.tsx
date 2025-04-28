import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ArrowRight, Users } from "lucide-react";
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface BaseProjectCardProps {
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
  className,
  repo,
  solo = false,
  ...props
}: ProjectCardProps) => {
  return (
    <Card
      className={`hover:drop-shadow-primary drop-shadow-sm **:transition-all **:duration-300 transition-all duration-300 group/projCard overflow-hidden ${className}`}
    >
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-baseline gap-2 group-hover/projCard:text-accent">
          {title}
          {!solo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant={"outline"}>
                    <Users size={16} />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {("groupDescription" in props && props.groupDescription) || "Team Project"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2.5">
        {link && (
          <Button variant="ghost" size="md" className="button-hover" asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <span className="mr-1">View Project</span>
              <ArrowRight size={16} className="delay-500 duration-100 group-hover/projCard:animate-bounce-right" />
            </a>
          </Button>
        )}
        <Button variant="ghost" size="md" className="button-hover" asChild>
          <a href={repo} target="_blank" rel="noopener noreferrer">
            <span className="mr-1">View repo</span>
            {!link ? (
              <ArrowRight
                size={16}
                className={`transition-transform duration-300 group-hover/projCard:transform group-hover/projCard:translate-x-1`}
              />
            ) : (
              <SiGithub />
            )}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
