import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/schema.graphql",
  documents: [],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        useIndexSignature: true,
      },
    },
  },
};
export default config;
