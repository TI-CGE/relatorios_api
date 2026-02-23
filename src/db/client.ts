import { SQL } from "bun";

const hostname = process.env.DB_HOST ?? "localhost";
const port = parseInt(process.env.DB_PORT ?? "3306", 10);
const database = process.env.DB_NAME ?? "esic";
const username = process.env.DB_USER ?? "";
const password = process.env.DB_PASSWORD ?? "";

export const db = new SQL({
  adapter: "mysql",
  hostname,
  port,
  database,
  username,
  password,
});
