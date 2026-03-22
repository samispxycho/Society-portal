import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "society_subscription",
  password: "sameer17",
  port: 5432,
});

export default pool;