import { Project, useGetProjectsQuery } from "@/generated/graphql";

export const ProjectsPage = () => {
  const { loading, error, data } = useGetProjectsQuery({
    variables: {},
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  console.log(data);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error :(</p>}
      {data && <p>{data.projects.length}</p>}
      {data &&
        data.projects.map((project: Partial<Project>) => (
          <p key={project.id}>
            {project.title} {project.content}
          </p>
        ))}
    </div>
  );
};
