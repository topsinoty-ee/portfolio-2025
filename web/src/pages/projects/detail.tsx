import { useGetProjectQuery } from "@/generated/graphql";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Archive, ArrowLeft, Clock, Edit3, ExternalLink, Star } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useAuth0 } from "@auth0/auth0-react";
import { cn } from "@/lib/utils.ts";
import secrets from "@/config.ts";
import { MdAddComment } from "react-icons/md";

export const ProjectPage = () => {
  let { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/5 to-secondary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-secondary mb-2">Project ID Required</h2>
              <p className="text-secondary/50">Please provide a valid project ID to view the project.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { loading, error, data } = useGetProjectQuery({
    variables: { id },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-secondary/20 rounded-lg w-1/4 mb-4"></div>
              <div className="h-12 bg-secondary/20 rounded-lg w-3/4 mb-6"></div>
              <div className="h-4 bg-secondary/20 rounded w-full mb-2"></div>
              <div className="h-4 bg-secondary/20 rounded w-5/6 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 bg-secondary/20 rounded-lg"></div>
                <div className="h-32 bg-secondary/20 rounded-lg"></div>
                <div className="h-32 bg-secondary/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md border-accent/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-6 h-6 text-accent/50" />
              </div>
              <h2 className="text-2xl font-bold text-accent mb-2">Error Loading Project</h2>
              <p className="text-accent/70">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/5 to-secondary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Archive className="w-6 h-6 text-secondary/600" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2">Project Not Found</h2>
              <p className="text-secondary/60">The project you're looking for doesn't exist or has been removed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = data.project;
  const updatedDate = new Date(project.updatedAt);

  const { isAuthenticated, user, loginWithPopup } = useAuth0();
  const isAdmin = user?.email === secrets.admin;

  return (
    <div className="min-h-screen">
      <div className="bg-white shadow-sm border-b border-secondary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto flex flex-col items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/projects">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Projects
                </Link>
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 w-full">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {project.isFeatured && (
                    <Badge variant="secondary" className="bg-accent/10 text-accent/80 border-accent/20">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {project.isArchived && (
                    <Badge variant="outline" className="text-secondary/60">
                      <Archive className="w-3 h-3 mr-1" />
                      Archived
                    </Badge>
                  )}
                  {project.for && (
                    <Badge variant="outline" className="text-secondary/60 border-secondary/20">
                      For: {project.for}
                    </Badge>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-secondary/90 leading-tight">{project.title}</h1>

                  {project.description && (
                    <p className="text-secondary/60 leading-relaxed line-clamp-3">{project.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.skillsRequired.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-primary/60 border-primary/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {project.link && (
                  <Button asChild variant="default" size="lg">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </a>
                  </Button>
                )}

                {project.repo && (
                  <Button asChild variant="outline" size="lg">
                    <a href={project.repo} target="_blank" rel="noopener noreferrer">
                      <SiGithub className="w-4 h-4 mr-2" />
                      Source Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="md:col-span-2 lg:col-span-3">
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-primary/90">Project Details</h2>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed">{project.content}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 mt-6">
                <CardHeader>
                  <h3 className="text-xl font-medium text-primary/90">Comments</h3>
                  {!isAuthenticated && (
                    <p className="text-secondary/60 text-sm italic">
                      You have to be{" "}
                      <span className="text-accent/60 cursor-pointer" onClick={() => loginWithPopup()}>
                        logged in
                      </span>{" "}
                      to comment
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-accent">
                  WIP: Comments section will be implemented soon.
                </CardContent>
              </Card>
              {/*  Plan to add a gallery*/}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Project Info */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-primary/90">Project Info</h3>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-secondary/50" />
                    <div>
                      <p className="text-secondary/60">
                        {updatedDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {project.collaborators.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-sm">
                      {project.collaborators.map((collaborator, index) => (
                        <Link
                          title={collaborator}
                          to={`https://github.com/${collaborator}`}
                          key={index}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {collaborator.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <p className="text-secondary/60">
                      {project.comments.length} comment{project.comments.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card
                className={cn("shadow-sm hover:shadow-md transition-shadow duration-200", {
                  "**:disabled": !isAuthenticated,
                })}
              >
                <CardContent className="flex flex-col gap-4">
                  <Button
                    asChild={isAdmin}
                    disabled={!isAdmin}
                    className={cn("w-full", { "opacity-50 disabled:cursor-not-allowed": !isAdmin })}
                    size="lg"
                  >
                    <Link to={`/projects/edit/${id}`} className="flex items-center justify-center gap-2">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Project
                    </Link>
                  </Button>
                  <Button
                    className={cn("w-full", { "opacity-50": !isAuthenticated })}
                    disabled={!isAuthenticated}
                    size="lg"
                  >
                    <MdAddComment className="w-4 h-4 mr-2" />
                    Add comment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
