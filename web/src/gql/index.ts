// noinspection JSUnusedGlobalSymbols

import { gql } from "@apollo/client";

export const PROJECT_FRAGMENT = gql`
  fragment ProjectFields on Project {
    id
    title
    content
    createdAt
    updatedAt
    collaborators
    description
    link
    repo
    skillsRequired
    isArchived
    comments
    accessList
    for
    isFeatured
    lastUpdatedBy
  }
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFields on Comment {
    id
    content
    createdAt
    isDeleted
    author
    project
    parentComment
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const GET_FEATURED_PROJECTS = gql`
  query GetFeaturedProjects {
    projects(filterBy: { isFeatured: true }) {
      id
      title
      description
      skillsRequired
      collaborators
      link
      repo
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const GET_ARCHIVED_PROJECTS = gql`
  query GetArchivedProjects {
    projects(filterBy: { isArchived: true }) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const GET_SKILLS = gql`
  query GetSkills {
    projects {
      skillsRequired
    }
  }
`;

export const SEARCH_PROJECTS = gql`
  query SearchProjects($filterBy: ProjectFilter!) {
    projects(filterBy: $filterBy) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const GET_MY_PROJECTS = gql`
  query GetMyProjects {
    myProjects {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($payload: ProjectInput!) {
    createProject(payload: $payload) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $payload: ProjectUpdateInput!) {
    updateProject(id: $id, payload: $payload) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const ARCHIVE_PROJECT = gql`
  mutation ArchiveProject($id: ID!) {
    archiveProject(id: $id) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

export const ADD_COLLABORATOR = gql`
  mutation AddCollaborator($input: CollaboratorInput!) {
    addCollaborator(input: $input) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const REMOVE_COLLABORATOR = gql`
  mutation RemoveCollaborator($input: CollaboratorInput!) {
    removeCollaborator(input: $input) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const ADD_COMMENT = gql`
  mutation AddComment($content: String!, $projectId: ID!) {
    addComment(content: $content, projectId: $projectId) {
      ...CommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

export const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($projectId: ID!) {
    commentAdded(projectId: $projectId) {
      ...CommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const PROJECT_UPDATED_SUBSCRIPTION = gql`
  subscription ProjectUpdated($projectId: ID!) {
    projectUpdated(projectId: $projectId) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;
