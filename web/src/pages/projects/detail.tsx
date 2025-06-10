import { useGetProjectQuery } from "@/generated/graphql";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button.tsx";

export const ProjectPage = () => {
  let { id } = useParams<{ id: string }>();
  if (!id) {
    return <p>Project ID is required</p>;
  }
  const { loading, error, data } = useGetProjectQuery({
    variables: { id },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.project) return <p>Project not found</p>;
  const project = data.project;
  return (
    <div>
      <div className="flex flex-col items-center gap-4">
        <h1>{project.title}</h1>
        <p>{project.content}</p>
        <p>Created at: {new Date(project.createdAt).toLocaleDateString()}</p>
        <p>Last updated by: {project.lastUpdatedBy}</p>
        <p>Skills required: {project.skillsRequired.join(", ")}</p>
        <a href={project?.link ?? ""} target="_blank" rel="noopener noreferrer">
          Project Link
        </a>
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noopener noreferrer">
            Repository
          </a>
        )}
      </div>

      <Button asChild className={"mt-4"}>
        <Link to={`/projects/edit/${id}`}>Edit</Link>
      </Button>
    </div>
  );
};
