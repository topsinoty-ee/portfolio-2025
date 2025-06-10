import { useParams } from "wouter";
import { useGetProjectQuery, useUpdateProjectMutation } from "@/generated/graphql";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth0 } from "@auth0/auth0-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  skillsRequired: z.string().transform((val) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  ),
});

type FormValues = z.infer<typeof formSchema>;
type MutationVariables = {
  id: string;
  payload: {
    title: string;
    content?: string | null;
    skillsRequired: string[];
  };
};

export const EditProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth0();
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useGetProjectQuery({
    variables: { id: id || "" },
    skip: !id,
    fetchPolicy: "network-only",
  });

  const [updateProject, { loading: mutationLoading, error: mutationError }] = useUpdateProjectMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      skillsRequired: "",
    },
  });

  useEffect(() => {
    if (data?.project) {
      form.reset({
        title: data.project.title,
        content: data.project.content || "",
        skillsRequired: data.project.skillsRequired?.join(", ") || "",
      });
    }
  }, [data, form]);

  const onSubmit = async (formValues: FormValues) => {
    try {
      // The transform in the schema already converts this to an array
      const skillsArray = formValues.skillsRequired;

      const variables: MutationVariables = {
        id: id!,
        payload: {
          title: formValues.title,
          content: formValues.content || null,
          skillsRequired: skillsArray,
        },
      };

      await updateProject({ variables });
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  if (authLoading || queryLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated || user?.email !== "oluwatobilobatemi05@gmail.com") {
    return <p>You must be logged in as an admin to edit a project</p>;
  }

  if (!id) {
    return <p>Project ID is required</p>;
  }

  if (queryError) {
    return <p>Error: {queryError.message}</p>;
  }

  if (!data?.project) {
    return <p>Project not found</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Project: {data.project.title}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 max-w-2xl bg-card p-6 rounded-lg shadow"
        >
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} className="w-full p-2 border rounded" />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content">Description</Label>
              <Textarea
                id="content"
                {...form.register("content")}
                className="w-full p-2 border rounded min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="skillsRequired">Skills Required</Label>
              <Input
                id="skillsRequired"
                {...form.register("skillsRequired")}
                className="w-full p-2 border rounded"
                placeholder="React, TypeScript, GraphQL"
              />
              <p className="text-sm text-muted-foreground mt-1">Separate skills with commas</p>
              {form.watch("skillsRequired") && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form
                    .getValues("skillsRequired")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={mutationLoading}>
            {mutationLoading ? "Saving..." : "Save Changes"}
          </Button>

          {mutationError && <p className="text-red-500 text-sm mt-2">Error: {mutationError.message}</p>}
        </form>
      </Form>
    </div>
  );
};
