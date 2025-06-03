import { QueryResolvers } from "@/generated/graphql";

const mockUser = {
  id: "1",
  email: "<EMAIL>",
  createdAt: String(new Date()),
  isVerified: true,
  role: "admin",
};

export const UserQueries: QueryResolvers = {
  me: async (_, __, { session }) => {
    return { ...mockUser, id: session.user };
  },
  user: async (_, { id }) => {
    return { ...mockUser, id, email: "<UserSpecificEMAIL>", role: "user" };
  },
};
