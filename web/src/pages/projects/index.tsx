import { gql, useQuery } from "@apollo/client";

const getAllProjects = gql`
  query getAllProjects {
    projects {
      id
      title
      content
      comments
      repo
      isArchived
      skillsRequired
      accessList
    }
  }
`;

export const ProjectsPage = () => {
  const { loading, error, data } = useQuery(getAllProjects);

  console.log(data);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error :(</p>}
      {data && <p>{data.projects.length}</p>}
      {data &&
        data.projects.map((project: any) => (
          <p key={project.id}>
            {project.title} {project.content}
          </p>
        ))}
    </div>
  );
};
