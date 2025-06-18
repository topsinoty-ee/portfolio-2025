import dotenv from "dotenv";

dotenv.config();

export default {
  dbSecret: process.env.DB_SECRET,
  gitPersonalAccessToken: process.env.GIT_PERSONAL_ACCESS_TOKEN,
  auth0Domain: process.env.AUTH0_DOMAIN,
  auth0Audience: process.env.AUTH0_AUDIENCE,
}
