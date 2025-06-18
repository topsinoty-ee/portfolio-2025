import { Link, useLocation, useParams } from "wouter";
import { useGetProjectQuery, useUpdateProjectMutation } from "@/generated/graphql";
import { z } from "zod";
import { useAuth0 } from "@auth0/auth0-react";
import { BetterForm } from "@/components/ui/betterForm.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Eye, Loader2, Lock, Save, Shield } from "lucide-react";
import secret from "@/config";

export const EditProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth0();
  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useGetProjectQuery({
    variables: { id: id || "" },
    skip: !id,
    fetchPolicy: "network-only",
  });

  // @ts-ignore
  const [updateProject, { loading: mutationLoading, error: mutationError }] = useUpdateProjectMutation();

  const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
    collaborators: z.array(z.string()).optional(),
    link: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    repo: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    skillsRequired: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    for: z.string().max(100, "For field must be less than 100 characters").optional(),
  });

  const canEdit = () => {
    if (!isAuthenticated || !user || !data?.project) return false;

    return user.email === secret.admin;
  };

  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (!id || !canEdit()) return;

    try {
      const updateData = {
        ...formData,
      };

      const result = await updateProject({
        variables: {
          id,
          payload: updateData,
        },
      });

      if (result.data) {
        await refetch();

        setTimeout(() => {
          setLocation(`/projects/${id}`);
        }, 1000);
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Authenticating...</h2>
              <p className="text-slate-600">Please wait while we verify your identity.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-900 mb-2">Authentication Required</h2>
              <p className="text-red-700 mb-4">You must be logged in to edit projects.</p>
              <Button onClick={() => window.location.reload()} className="w-full">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No project ID
  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Project ID Required</h2>
              <p className="text-slate-600 mb-4">A valid project ID is required to edit a project.</p>
              <Button asChild variant="outline">
                <Link to="/projects">Back to Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading project data
  if (queryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded-lg w-1/4 mb-6"></div>
              <div className="space-y-6">
                <div className="h-12 bg-slate-200 rounded-lg"></div>
                <div className="h-32 bg-slate-200 rounded-lg"></div>
                <div className="h-12 bg-slate-200 rounded-lg"></div>
                <div className="h-12 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Query error
  if (queryError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-900 mb-2">Error Loading Project</h2>
              <p className="text-red-700 mb-4">{queryError.message}</p>
              <div className="space-y-2">
                <Button onClick={() => refetch()} className="w-full">
                  Try Again
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/projects">Back to Projects</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Project not found
  if (!data?.project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
              <p className="text-slate-600 mb-4">
                The project you're trying to edit doesn't exist or has been removed.
              </p>
              <Button asChild variant="outline">
                <Link to="/projects">Back to Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Permission check
  if (!canEdit()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-amber-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-amber-900 mb-2">Access Denied</h2>
              <p className="text-amber-700 mb-4">You don't have permission to edit this project.</p>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/projects/${id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Project
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/projects">Back to Projects</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = data.project;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Button variant="ghost" asChild>
                <Link to={`/projects/${id}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Project
                </Link>
              </Button>
              {/*{hasUnsavedChanges && (*/}
              {/*  <Badge variant="outline" className="text-amber-600 border-amber-200">*/}
              {/*    Unsaved Changes*/}
              {/*  </Badge>*/}
              {/*)}*/}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Project</h1>
                <p className="text-lg text-slate-600">{project.title}</p>
              </div>

              <div className="flex gap-3">
                <Button asChild variant="outline" size="lg">
                  <Link to={`/projects/${id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Error Alert */}
          {mutationError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to update project: {mutationError.message}</AlertDescription>
            </Alert>
          )}

          {/* Form Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BetterForm
                formSchema={formSchema}
                defaultValues={{
                  title: project.title,
                  description: project.description || "",
                  collaborators: project.collaborators,
                  link: project.link || "",
                  repo: project.repo || "",
                  skillsRequired: project.skillsRequired,
                  isFeatured: project.isFeatured,
                  for: project.for || "",
                }}
                fields={[
                  {
                    name: "title",
                    placeholder: "Project Title",
                    type: "text",
                    required: true,
                  },
                  {
                    name: "description",
                    placeholder: "Brief description of your project...",
                    type: "textarea",
                  },
                  {
                    name: "collaborators",
                    placeholder: "user@example.com, another@example.com",
                    type: "text",
                  },
                  {
                    name: "link",
                    placeholder: "https://example.com",
                    type: "text",
                  },
                  {
                    name: "repo",
                    placeholder: "https://github.com/username/repo",
                    type: "text",
                  },
                  {
                    name: "skillsRequired",
                    placeholder: "React, TypeScript, Node.js",
                    type: "multiselect",
                  },
                  {
                    name: "for",
                    placeholder: "Client name, company, or purpose",
                    type: "text",
                  },
                ]}
                onSubmit={handleSubmit}
                // onChange={() => setHasUnsavedChanges(true)}
                // submitButton={
                //   <Button
                //     type="submit"
                //     size="lg"
                //     disabled={isSubmitting || mutationLoading}
                //     className="w-full lg:w-auto"
                //   >
                //     {isSubmitting || mutationLoading ? (
                //       <>
                //         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                //         Saving...
                //       </>
                //     ) : (
                //       <>
                //         <Save className="w-4 h-4 mr-2" />
                //         Save Changes
                //       </>
                //     )}
                //   </Button>
                // }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
