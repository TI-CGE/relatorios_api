import mysql from "mysql2/promise";

const host = process.env.DB_HOST ?? "localhost";
const port = parseInt(process.env.DB_PORT ?? "3306", 10);
const database = process.env.DB_NAME ?? "esic";
const user = process.env.DB_USER ?? "";
const password = process.env.DB_PASSWORD ?? "";

export const pool = mysql.createPool({
  host,
  port,
  database,
  user,
  password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
