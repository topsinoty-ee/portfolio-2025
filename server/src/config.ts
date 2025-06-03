import dotenv from "dotenv";

dotenv.config();

const dbSecret = process.env.DB_SECRET;
const gitPersonalAccessToken = process.env.GIT_PERSONAL_ACCESS_TOKEN;

export { dbSecret, gitPersonalAccessToken };
