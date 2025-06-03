import { MutationResolvers } from "@/generated/graphql";
import { User } from "@/schemas/user";

export const UserMutations: MutationResolvers = {
  login: async (_, { email }, { req }) => {
    try {
      let user = await User.findOne({ email })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (!user) {
        user = await User.create({
          email,
        });
      }

      req.session.auth = {
        user: {
          email: user.email,
          id: user._id,
        },
        isAuthenticated: true,
      };

      await req.session.save();
      return true;
    } catch (error) {
      console.error("Login/Registration failed:", error);
      return false;
    }
  },
};
