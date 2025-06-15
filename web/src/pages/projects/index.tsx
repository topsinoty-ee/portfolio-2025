import { Project, useGetProjectsQuery } from "@/generated/graphql";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Archive, Calendar, ExternalLink, MessageSquare, Star, User, Users } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

export const ProjectsPage = () => {
  const { loading, error, data } = useGetProjectsQuery({
    variables: {},
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-80">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>Failed to load projects. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data || data.projects.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>No projects found. Create your first project to get started.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Manage and explore {data.projects.length} projects</p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.projects.map((project: Partial<Project>) => (
          <Card key={project.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg leading-tight flex items-center gap-2">
                    {project.title}
                    {project.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    {project.isArchived && <Archive className="h-4 w-4 text-muted-foreground" />}
                  </CardTitle>
                  {project.for && <CardDescription className="text-sm">For: {project.for}</CardDescription>}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {/* Content */}
              <p className="text-sm text-muted-foreground line-clamp-3">{project.content}</p>

              {/* Skills Required */}
              {project.skillsRequired && project.skillsRequired.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Skills Required</p>
                  <div className="flex flex-wrap gap-1">
                    {project.skillsRequired.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skillsRequired.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.skillsRequired.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Collaborators */}
              {project.collaborators && project.collaborators.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Collaborators
                  </p>
                  <div className="flex -space-x-2">
                    {project.collaborators.slice(0, 4).map((collaborator, index) => (
                      <Avatar key={index} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs">{getInitials(collaborator)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.collaborators.length > 4 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-medium">+{project.collaborators.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Metadata */}
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {formatDate(project.createdAt ?? "")}
                </div>
                {project.updatedAt && project.updatedAt !== project.createdAt && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Updated {formatDate(project.updatedAt)}
                  </div>
                )}
                {project.comments && project.comments.length > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {project.comments.length} comments
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-0 gap-2">
              {project.link && (
                <Button variant="outline" size="default" className="flex-1">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              )}
              {project.repo && (
                <Button variant="outline" size="default" className="flex-1">
                  <SiGithub className="h-3 w-3 mr-1" />
                  Code
                </Button>
              )}
              {!project.link && !project.repo && (
                <Button variant="outline" size="default" className="flex-1">
                  View Details
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
